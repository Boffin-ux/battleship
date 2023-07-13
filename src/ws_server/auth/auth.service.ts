import { IAuthService, IUserData, IWinnersData } from './interfaces';

export class AuthService implements IAuthService {
  private users: IUserData[];
  private winners: IWinnersData[];

  constructor() {
    this.users = [];
    this.winners = [];
  }

  getUser(name: string): IUserData | undefined {
    return this.users.find((user) => user.name === name);
  }

  getUserById(playerId: string): IUserData | undefined {
    return this.users.find((user) => user.index === playerId);
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

  updateUser(userData: IUserData): IUserData | undefined {
    const user = this.getUser(userData.name);
    if (user) {
      user.socketId = userData.socketId;
    }
    return this.getUser(userData.name);
  }

  getWinners() {
    const winners = this.winners
      .filter(({ wins }) => wins > 0)
      .sort((winFirst, winLast) => winLast.wins - winFirst.wins);
    return winners.length > 0 && winners;
  }

  addWinner(data: IWinnersData): IWinnersData {
    this.winners.push(data);
    return data;
  }

  updateWinner(playerId: string): false | IWinnersData[] {
    const user = this.getUserById(playerId);
    this.winners = this.winners.map(({ name, wins }) =>
      name === user?.name ? { name, wins: wins + 1 } : { name, wins },
    );

    return this.getWinners();
  }
}
