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
  | IRoom
  | { type: Commands; data: IUserData; id: string }
  | (
      | IRoom
      | { type: Commands; data: false | IWinnersData[] }
      | { type: Commands; data: TUsersData; id: string }
    )[]
  | (IStartGame | ITurn)[]
  | (ITurn | IAttackAnswer)[]
  | (
      | IAttackAnswer
      | IFinishGame
      | { type: Commands; data: false | IWinnersData[] }
    )[]
  | undefined;

type TStringData = IRoom | { type: Commands; data: IUserData; id: string };

export { IWsServer, TSendData, TStringData };
