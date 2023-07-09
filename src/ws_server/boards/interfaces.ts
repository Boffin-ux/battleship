interface IBoardsService {
  getBoard(gameId: string): IBoardsData | undefined;
  createBoard(data: IBoardsData): IBoardsData | undefined;
  updateBoard(gameId: string, player: IPlayer): IBoardsData | undefined;
  deleteBoard(gameId: string): void;
  getEnemyId(gameId: string, playerId: string): string | undefined;
}

type TBoardsData = IStartGameData | IShipsData | ITurnData;

interface IBoards {
  type: string;
  data: TBoardsData;
  id: string;
}

interface IBoardsData {
  gameId: string;
  players: IPlayer[];
}

interface IShipsData {
  gameId: string;
  ships: IShips[];
  indexPlayer: string;
}

enum sizeShips {
  'small',
  'medium',
  'large',
  'huge',
}

interface IShips {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: sizeShips;
}

interface IPlayer {
  ships: IShips[];
  indexPlayer: string;
  socketId: string;
}

interface IStartGameData {
  ships: IShips[];
  indexPlayer: string;
}

interface IStartGame {
  type: string;
  data: IStartGameData;
  id: string;
}

interface ITurnData {
  currentPlayer: string;
}

interface ITurn {
  type: string;
  data: ITurnData;
  id: string;
}

interface IAttack {
  x: number;
  y: number;
  gameId: string;
  indexPlayer: string;
}

interface IRandomAttack {
  gameId: string;
  indexPlayer: string;
}

interface IBoardsControl {
  run(type: string, data: IBoardsData, socketId: string): void;
}

export {
  IBoardsData,
  IShipsData,
  IBoardsControl,
  IPlayer,
  IStartGame,
  ITurn,
  IAttack,
  IRandomAttack,
  IBoardsService,
  IBoards,
};
