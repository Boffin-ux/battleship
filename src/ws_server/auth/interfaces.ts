interface IUserData {
  socketId: string;
  name: string;
  password: string;
  index: string;
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
  getUser(userId: string): void;
  getAllUser(): void;
  getUserBySocket(sockedId: string): void;
  createUser(userData: IUserData): void;
}

export {
  IUserData,
  IUserErrData,
  TUsersData,
  IAuth,
  IAuthControl,
  IAuthService,
};
