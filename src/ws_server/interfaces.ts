import { IUserData, IWinnersData, TUsersData } from './auth/interfaces';
import {
  IAttackAnswer,
  IFinishGame,
  IStartGame,
  ITurn,
} from './boards/interfaces';
import { Commands } from './constants';
import { IRoom } from './room/interfaces';

interface IWsServer {
  run(): void;
}

type TSendData =
  | (IStartGame | ITurn)[]
  | IRoom
  | (IRoom | { type: Commands; data: false | IWinnersData[] })[]
  | (
      | ITurn
      | IAttackAnswer
      | IFinishGame
      | { type: Commands; data: false | IWinnersData[] }
      | undefined
    )[]
  | undefined;

type TStringData = IRoom | { type: Commands; data: IUserData; id: string };

export { IWsServer, TSendData, TStringData };
