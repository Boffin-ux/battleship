interface IUserData {
  socketId: string;
  name: string;
  password: string;
  index: string;
}

interface IWinnersData {
  name: string;
  wins: number;
}

interface IUserErrData {
  name: string;
  index: string;
  error?: boolean;
  errorText: string;
}

type TUsersData = IUserData | IUserErrData;

interface IAuth {
  type: string;
  data: TUsersData;
  id: string;
}

interface IAuthControl {
  auth(type: string, data: IUserData, socketId: string): void;
}

interface IAuthService {
  getUser(userId: string): IUserData | undefined;
  getUserBySocket(sockedId: string): IUserData | undefined;
  getSocketId(userId: string): string | undefined;
  createUser(userData: IUserData): IUserData;
  updateUser(userData: IUserData): IUserData | undefined;
  getWinners(): false | IWinnersData[];
  addWinner(data: IWinnersData): IWinnersData;
  updateWinner(playerId: string): false | IWinnersData[];
}

export {
  IUserData,
  IUserErrData,
  TUsersData,
  IAuth,
  IAuthControl,
  IAuthService,
  IWinnersData,
};
