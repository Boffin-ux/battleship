import { ShotStatus } from './constants';

interface IBoardsService {
  getBoard(gameId: string): IBoardsData | undefined;
  createBoard(data: IBoardsData): IBoardsData | undefined;
  updateBoard(gameId: string, player: IPlayer): IBoardsData | undefined;
  deleteBoard(gameId: string): boolean;
  getEnemyId(gameId: string, playerId: string): string | undefined;
  getPlayerShips(gameId: string, playerId: string): IPlayer | undefined;
  checkPosition(
    gameId: string,
    playerId: string,
    position: IPosition,
  ): IDamageShips | undefined;
  damageShip(
    gameId: string,
    playerId: string,
    position: IPosition,
  ): IDamageShips | undefined;
  createGameShots(data: IShotsData): IShotsData;
  updateGameShots(gameId: string, player: IPlayerShots): IShotsData | undefined;
  getGameShots(gameId: string): IShotsData | undefined;
  deleteGameShots(gameId: string): boolean;
  getPlayerShots(gameId: string, playerId: string): IPlayerShots | undefined;
  checkPlayerShot(
    gameId: string,
    playerId: string,
    coords: IPosition,
  ): boolean | undefined;
  addPlayerShot(
    gameId: string,
    playerId: string,
    shotsShips: IShotsShips,
  ): boolean;
}

interface IBoardsData {
  gameId: string;
  players: IPlayer[];
  turnPlayerId: string;
}

interface IShipsData {
  gameId: string;
  ships: IShips[];
  indexPlayer: string;
}

interface IPosition {
  x: number;
  y: number;
}

type TSizeShips = 'small' | 'medium' | 'large' | 'huge';

interface IShips {
  position: IPosition;
  direction: boolean;
  length: number;
  type: TSizeShips;
}

interface IDamageShips {
  position: IPosition[];
  direction: boolean;
  length: number;
}

interface IPlayer {
  ships: IShips[];
  damageShips: IDamageShips[];
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

interface IAttackData {
  position: IPosition;
  currentPlayer: string;
  status: string;
}

interface IAttackAnswer {
  type: string;
  data: IAttackData | IAttackData[];
  id: string;
}

interface IRandomAttack {
  gameId: string;
  indexPlayer: string;
}

type TBoardsControlData = IAttack | IRandomAttack | IShipsData;

interface IBoardsControl {
  run(type: string, data: TBoardsControlData, socketId: string): void;
}

type TShotStatus = ShotStatus.SHOT | ShotStatus.MISS | ShotStatus.KILLED;

interface IShotsShips {
  position: IPosition;
  status: TShotStatus;
}

interface IPlayerShots {
  playerId: string;
  shots: IShotsShips[];
}

interface IShotsData {
  gameId: string;
  players: IPlayerShots[];
}

type TAnswerReduce = IAttackAnswer[] | IStartGame[] | ITurn[] | IAttackAnswer[];

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
  IShips,
  IPosition,
  IAttackAnswer,
  IAttackData,
  IDamageShips,
  IShotsData,
  IPlayerShots,
  IShotsShips,
  TShotStatus,
  TAnswerReduce,
  TBoardsControlData,
};
