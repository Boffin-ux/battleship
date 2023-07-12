import { Commands } from '../constants';
import { BoardsService } from './boards.service';
import { ShotStatus } from './constants';

import {
  IBoardsControl,
  IStartGame,
  ITurn,
  IAttack,
  IRandomAttack,
  IShipsData,
  IPlayer,
  IBoards,
  IShips,
  IPosition,
  IAttackAnswer,
  IAttackData,
  IDamageShips,
} from './interfaces';

type TRun = IBoards | undefined | void | (IStartGame | ITurn)[];

export class BoardsController implements IBoardsControl {
  private boards: BoardsService;

  constructor() {
    this.boards = new BoardsService();
  }

  run(type: string, data, socketId: string) {
    switch (type) {
      case Commands.ADD_SHIPS:
        return this.addShips(data, socketId);
      case Commands.ATTACK:
        return this.attack(data);
      case Commands.RANDOM_ATTACK:
        return this.randomAttack(data);
      default:
        return;
    }
  }

  private attack(data: IAttack) {
    const { gameId, x, y, indexPlayer } = data;
    const position = { x, y };
    const getBoard = this.boards.getBoard(gameId);
    const enemyId = this.boards.getEnemyId(gameId, indexPlayer);
    const checkShot = this.boards.checkPlayerShot(
      gameId,
      indexPlayer,
      position,
    );

    if (getBoard && enemyId) {
      if (checkShot) {
        return this.turn(getBoard.players, indexPlayer);
      }

      if (getBoard.turnPlayerId !== enemyId) {
        const getShots = this.shot(position, gameId, enemyId, indexPlayer);
        const shots = this.answerAttack(getBoard.players, getShots);
        let turns = this.turn(getBoard.players, enemyId);

        if (getShots instanceof Array || getShots.status === ShotStatus.SHOT) {
          turns = this.turn(getBoard.players, indexPlayer);
          this.boards.updateTurn(gameId, indexPlayer);
          return [...shots, ...turns];
        }

        this.boards.updateTurn(gameId, enemyId);
        return [...shots, ...turns];
      }
    }
  }

  private shot(
    position: IPosition,
    gameId: string,
    enemyId: string,
    currentPlayer: string,
  ) {
    const data = { position, currentPlayer, status: ShotStatus.MISS };
    const shotToShip = this.boards.damageShip(gameId, enemyId, position);

    if (shotToShip) {
      if (shotToShip.length > 0) {
        this.boards.addPlayerShot(gameId, currentPlayer, {
          position,
          status: ShotStatus.SHOT,
        });
        return { ...data, status: ShotStatus.SHOT };
      }
      const kill = this.shellingPositions(
        gameId,
        shotToShip.position,
        currentPlayer,
      );
      const miss = this.missPosition(shotToShip, currentPlayer, gameId);
      return [...kill, ...miss];
    }
    return data;
  }

  private missPosition(
    shotToShip: IDamageShips,
    currentPlayer: string,
    gameId: string,
  ) {
    const { position, direction } = shotToShip;
    const startShip = position[0];
    const shipSize = position.length;
    const dx = direction ? 2 : shipSize + 1;
    const dy = !direction ? 2 : shipSize + 1;
    const result: IPosition[] = [];

    for (let y = startShip.y - 1; y < startShip.y + dy; y++) {
      for (let x = startShip.x - 1; x < startShip.x + dx; x++) {
        const checkRange = x >= 0 && y >= 0 && x < 10 && y < 10;
        const isKill = position.some(
          (coords) => coords.x === x && coords.y === y,
        );
        if (checkRange && !isKill) {
          result.push({ x, y });
        }
      }
    }

    return this.shellingPositions(
      gameId,
      result,
      currentPlayer,
      ShotStatus.MISS,
    );
  }

  private shellingPositions(
    gameId: string,
    position: IPosition[],
    currentPlayer: string,
    status = ShotStatus.KILLED,
  ) {
    position.forEach((coords) => {
      this.boards.addPlayerShot(gameId, currentPlayer, {
        position: coords,
        status,
      });
    });
    return position.reduce<IAttackData[]>((acc, coords) => {
      acc.push({
        position: coords,
        currentPlayer,
        status,
      });
      return acc;
    }, []);
  }

  private randomAttack({ gameId, indexPlayer }: IRandomAttack) {
    const getBoard = this.boards.getBoard(gameId);
    const enemyId = this.boards.getEnemyId(gameId, indexPlayer);
    if (getBoard && enemyId) {
      return this.turn(getBoard.players, enemyId);
    }
  }

  private addShips(shipsData: IShipsData, socketId: string) {
    const { gameId, indexPlayer } = shipsData;
    const getBoard = this.boards.getBoard(gameId);
    const getGameShots = this.boards.getGameShots(gameId);

    if (getBoard && getGameShots) {
      const updateBoard = this.updateBoard(shipsData, socketId);
      const enemyId = this.boards.getEnemyId(gameId, indexPlayer);

      if (updateBoard && enemyId) {
        const game = this.startGame(updateBoard.players);
        const turn = this.turn(updateBoard.players, enemyId);
        return [...game, ...turn];
      }
    }

    this.createBoard(shipsData, socketId);
  }

  private convertShips(ships: IShips[]): IDamageShips {
    return ships.reduce((acc, { length, direction, position }: IShips) => {
      if (length === 4) {
        const huge: IPosition[] = [];

        if (direction) {
          for (let i = 0; i < length; i++) {
            huge.push({ x: position.x, y: position.y + i });
          }
        } else {
          for (let i = 0; i < length; i++) {
            huge.push({ x: position.x + i, y: position.y });
          }
        }
        acc = { ...acc, position: huge, direction, length };
      }

      if (length === 3) {
        const large: IPosition[] = [];

        if (direction) {
          for (let i = 0; i < length; i++) {
            large.push({ x: position.x, y: position.y + i });
          }
        } else {
          for (let i = 0; i < length; i++) {
            large.push({ x: position.x + i, y: position.y });
          }
        }
        acc = { ...acc, position: large, direction, length };
      }

      if (length === 2) {
        const medium: IPosition[] = [];

        if (direction) {
          for (let i = 0; i < length; i++) {
            medium.push({ x: position.x, y: position.y + i });
          }
        } else {
          for (let i = 0; i < length; i++) {
            medium.push({ x: position.x + i, y: position.y });
          }
        }
        acc = { ...acc, position: medium, direction, length };
      }

      if (length === 1) {
        acc = { ...acc, position: [position], direction, length };
      }

      return acc;
    }, {} as IDamageShips);
  }

  private createBoard(shipsData: IShipsData, socketId: string) {
    const { gameId, ships, indexPlayer } = shipsData;
    const damageShips = ships.map((ship) => this.convertShips([ship]));
    const player = {
      ships,
      damageShips,
      indexPlayer,
      socketId,
    };

    const playerShots = {
      playerId: indexPlayer,
      shots: [],
    };

    this.boards.createGameShots({
      gameId,
      players: [playerShots],
    });

    return this.boards.createBoard({
      gameId,
      players: [player],
      turnPlayerId: indexPlayer,
    });
  }

  private updateBoard(shipsData: IShipsData, socketId: string) {
    const { gameId, ships, indexPlayer } = shipsData;
    const damageShips = ships.map((ship) => this.convertShips([ship]));
    const player = {
      ships,
      damageShips,
      indexPlayer,
      socketId: socketId,
    };

    const playerShots = {
      playerId: indexPlayer,
      shots: [],
    };

    this.boards.updateGameShots(gameId, playerShots);
    return this.boards.updateBoard(gameId, player);
  }

  private startGame(players: IPlayer[]): IStartGame[] {
    return players.reduce<IStartGame[]>(
      (acc, { ships, indexPlayer, socketId }) => {
        const data = { ships, indexPlayer };
        const player = { type: Commands.START_GAME, data, id: socketId };

        acc.push(player);
        return acc;
      },
      [],
    );
  }

  private turn(players: IPlayer[], playerId: string): ITurn[] {
    return players.reduce<ITurn[]>((acc, { socketId }) => {
      const data = { currentPlayer: playerId };
      const player = { type: Commands.TURN, data, id: socketId };
      acc.push(player);
      return acc;
    }, []);
  }

  private answerAttack(players: IPlayer[], data: IAttackData | IAttackData[]) {
    return players.reduce<IAttackAnswer[]>((acc, { socketId }) => {
      if (data instanceof Array) {
        data.map((ship) => {
          acc.push({ type: Commands.ATTACK, data: ship, id: socketId });
        });
      } else {
        acc.push({ type: Commands.ATTACK, data, id: socketId });
      }
      return acc;
    }, []);
  }
}
