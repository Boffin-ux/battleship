import {
  IBoardsData,
  IBoardsService,
  IPlayer,
  IPlayerShots,
  IPosition,
  IShotsData,
  IShotsShips,
} from './interfaces';

export class BoardsService implements IBoardsService {
  private boards: IBoardsData[];
  private shots: IShotsData[];

  constructor() {
    this.boards = [];
    this.shots = [];
  }

  getBoard(gameId: string): IBoardsData | undefined {
    return this.boards.find((board) => board.gameId === gameId);
  }

  getBoardByUserId(userId: string): IBoardsData | undefined {
    return this.boards.find(({ players }) => {
      return players.some((player) => player.indexPlayer === userId);
    });
  }

  createBoard(data: IBoardsData) {
    this.boards.push(data);
    return data;
  }

  updateBoard(gameId: string, player: IPlayer) {
    const board = this.getBoard(gameId);
    if (board) {
      board.players = [...board.players, player];
    }
    return this.getBoard(gameId);
  }

  deleteBoard(gameId: string) {
    this.boards.splice(
      this.boards.findIndex((board) => board.gameId === gameId),
      1,
    );
    return true;
  }

  getEnemyId(gameId: string, playerId: string) {
    const board = this.getBoard(gameId);
    const player = board?.players?.find(
      (player) => player.indexPlayer !== playerId,
    );
    return player && player.indexPlayer;
  }

  updateTurn(gameId: string, playerId: string) {
    const board = this.getBoard(gameId);
    if (board) {
      board.turnPlayerId = playerId;
    }
    return playerId;
  }

  private getPlayerShips(gameId: string, playerId: string) {
    const board = this.getBoard(gameId);
    const player = board?.players?.find(
      (player) => player.indexPlayer === playerId,
    );
    return player;
  }

  private checkPosition(gameId: string, playerId: string, position: IPosition) {
    const playerShips = this.getPlayerShips(gameId, playerId);
    return playerShips?.damageShips.find((ship) =>
      ship.position.some(({ x, y }) => x === position.x && y === position.y),
    );
  }

  damageShip(gameId: string, playerId: string, position: IPosition) {
    const getShip = this.checkPosition(gameId, playerId, position);
    if (getShip) {
      getShip.length--;
    }
    return this.checkPosition(gameId, playerId, position);
  }

  createGameShots(data: IShotsData) {
    this.shots.push(data);
    return data;
  }

  updateGameShots(gameId: string, player: IPlayerShots) {
    const shotsGame = this.getGameShots(gameId);
    if (shotsGame) {
      shotsGame.players = [...shotsGame.players, player];
    }
    return this.getGameShots(gameId);
  }

  getGameShots(gameId: string) {
    return this.shots.find((game) => game.gameId === gameId);
  }

  deleteGameShots(gameId: string) {
    this.shots.splice(
      this.shots.findIndex((game) => game.gameId === gameId),
      1,
    );
    return true;
  }

  getPlayerShots(gameId: string, playerId: string) {
    const shotsGame = this.getGameShots(gameId);
    const player = shotsGame?.players?.find(
      (player) => player.playerId === playerId,
    );
    return player;
  }

  checkPlayerShot(gameId: string, playerId: string, coords: IPosition) {
    const playerShots = this.getPlayerShots(gameId, playerId);
    return playerShots?.shots.some(
      (shot) => shot.position.x === coords.x && shot.position.y === coords.y,
    );
  }

  addPlayerShot(gameId: string, playerId: string, shotsShips: IShotsShips) {
    const playerShots = this.getPlayerShots(gameId, playerId);
    if (playerShots) {
      playerShots.shots = [...playerShots.shots, shotsShips];
    }
    return true;
  }

  availableShips(gameId: string, playerId: string) {
    const playerShips = this.getPlayerShips(gameId, playerId);
    return playerShips?.damageShips.some((ship) => ship.length > 0);
  }
}
