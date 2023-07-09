import { IBoardsData, IBoardsService, IPlayer } from './interfaces';

export class BoardsService implements IBoardsService {
  boards: IBoardsData[];

  constructor() {
    this.boards = [];
  }

  getBoard(gameId: string): IBoardsData | undefined {
    return this.boards.find((board) => board.gameId === gameId);
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
  }

  getEnemyId(gameId: string, playerId: string) {
    const board = this.getBoard(gameId);
    const player = board?.players?.find(
      (player) => player.indexPlayer !== playerId,
    );
    return player && player.indexPlayer;
  }
}
