import { IAuthControl, IUserData, IUserErrData } from './interfaces';
import { AuthService } from './auth.service';
import { Commands, MESSAGE } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { TUsersData } from './interfaces';
import { IRoom } from '../room/interfaces';

export class AuthController implements IAuthControl {
  private usersDb: AuthService;
  private updateRoom: IRoom;

  constructor(usersDb: AuthService, updateRoom: IRoom) {
    this.usersDb = usersDb;
    this.updateRoom = updateRoom;
  }

  auth(type: string, userData: IUserData, socketId: string) {
    const { name, password, index } = userData;
    const user = this.usersDb.getUser(name);
    const winners = this.usersDb.getWinners();
    const updateWinners = { type: Commands.UPDATE_WINNERS, data: winners };

    if (user) {
      if (user.password === password) {
        const updateUser = this.usersDb.updateUser({
          ...userData,
          socketId,
        });

        const currentUser = updateUser
          ? { type, data: updateUser, id: updateUser.socketId }
          : { type, data: user, id: user.socketId };

        return winners ? [currentUser, updateWinners] : currentUser;
      }

      const errorText = MESSAGE.INVALID_PASSWORD;
      const getErr = this.sendErr({ name, index, errorText });
      const regData = { type, data: getErr, id: socketId };
      return [regData, this.updateRoom];
    }
    const createUser: TUsersData = this.signUp(userData, socketId);
    const regData = { type, data: createUser, id: socketId };

    return winners
      ? [regData, this.updateRoom, updateWinners]
      : [regData, this.updateRoom];
  }

  private sendErr({ name, index, errorText }: IUserErrData) {
    return {
      name,
      index,
      error: true,
      errorText,
    };
  }

  private signUp(userData: IUserData, socketId: string): TUsersData {
    const userId: string = uuidv4();

    if (this.validateUser(userData)) {
      this.usersDb.addWinner({ name: userData.name, wins: 0 });

      return this.usersDb.createUser({
        ...userData,
        index: userId,
        socketId,
      });
    } else {
      const errorText = MESSAGE.DATA_IS_NOT_VALID;
      return this.sendErr({
        name: userData.name,
        index: userData.index,
        errorText,
      });
    }
  }

  private validateUser({ name, password }: IUserData): boolean {
    const moreLength = 4;
    return name.length > moreLength && password.length > moreLength;
  }
}
