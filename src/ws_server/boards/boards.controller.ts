import { Commands } from '../constants';
import { BoardsService } from './boards.service';

import {
  IBoardsControl,
  IStartGame,
  ITurn,
  IAttack,
  IRandomAttack,
  IShipsData,
  IPlayer,
  IBoards,
} from './interfaces';

type TRun = IBoards | undefined | void | (IStartGame | ITurn)[];

export class BoardsController implements IBoardsControl {
  private boards: BoardsService;
  private currentSocketId: string;

  constructor() {
    this.boards = new BoardsService();
    this.currentSocketId = '';
  }

  run(type: string, data, socketId: string): TRun {
    this.currentSocketId = socketId;
    switch (type) {
      case Commands.ADD_SHIPS:
        return this.addShips(data);
      default:
        return;
    }
  }

  private addShips(shipsData: IShipsData) {
    const { gameId, indexPlayer } = shipsData;
    const getBoard = this.boards.getBoard(gameId);

    if (getBoard) {
      const updateBoard = this.updateBoard(shipsData);
      const enemyId = this.boards.getEnemyId(gameId, indexPlayer);

      if (updateBoard && enemyId) {
        const game = this.startGame(updateBoard.players);
        const turn = this.turn(updateBoard.players, enemyId);
        return [...game, ...turn];
      }
    }

    this.createBoard(shipsData);
  }

  private createBoard(shipsData: IShipsData) {
    const { gameId, ships, indexPlayer } = shipsData;
    const player = { ships, indexPlayer, socketId: this.currentSocketId };

    return this.boards.createBoard({ gameId, players: [player] });
  }

  private updateBoard(shipsData: IShipsData) {
    const { gameId, ships, indexPlayer } = shipsData;
    const player = { ships, indexPlayer, socketId: this.currentSocketId };

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

  private turn(players: IPlayer[], enemyPlayerId: string): ITurn[] {
    return players.reduce<ITurn[]>((acc, { socketId }) => {
      const data = { currentPlayer: enemyPlayerId };
      const player = { type: Commands.TURN, data, id: socketId };
      acc.push(player);
      return acc;
    }, []);
  }
}
