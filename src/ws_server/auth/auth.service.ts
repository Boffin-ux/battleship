import { IAuthService, IUserData } from './interfaces';

export class AuthService implements IAuthService {
  private users: IUserData[];

  constructor() {
    this.users = [];
  }

  getUser(userName: string): IUserData | undefined {
    return this.users.find((user) => user.name === userName);
  }

  getAllUser(): IUserData[] {
    return this.users;
  }

  getUserBySocket(sockedId: string): IUserData | undefined {
    return this.users.find((user) => user.socketId === sockedId);
  }

  getSocketId(userId: string): string | undefined {
    return this.users.find((user) => user.index === userId)?.socketId;
  }

  createUser(userData: IUserData): IUserData {
    this.users.push(userData);
    return userData;
  }
}
