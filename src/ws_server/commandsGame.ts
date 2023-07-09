import { AuthController } from './auth/auth.controller';
import { RoomController } from './room/room.controller';
import { Commands } from './constants';
import { AuthService } from './auth/auth.service';

export class CommandsGame {
  private users: AuthController;
  private room: RoomController;
  private usersDb: AuthService;

  constructor() {
    this.usersDb = new AuthService();
    this.room = new RoomController(this.usersDb);
    this.users = new AuthController(this.usersDb, this.room.updateRoom());
  }

  runController(type: string, data, socketId: string) {
    switch (type) {
      case Commands.REG_USER:
        return this.users.auth(type, data, socketId);
      case Commands.CREATE_ROOM:
      case Commands.ADD_USER_TO_ROOM:
        return this.room.run(type, data, socketId);
      default:
        return;
    }
  }
}
