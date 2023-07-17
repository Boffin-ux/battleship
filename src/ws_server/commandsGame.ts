import { AuthController } from './auth/auth.controller';
import { RoomController } from './room/room.controller';
import { Commands } from './constants';
import { AuthService } from './auth/auth.service';
import { BoardsController } from './boards/boards.controller';
import { IUserData } from './auth/interfaces';
import { IShipsData, TBoardsControlData } from './boards/interfaces';
import { ICreateGame, IRoomReqData } from './room/interfaces';
import { BOT_DATA, BOT_SHIPS } from './boards/constants';

export class CommandsGame {
  private users: AuthController;
  private room: RoomController;
  private usersDb: AuthService;
  private boards: BoardsController;

  constructor() {
    this.usersDb = new AuthService();
    this.room = new RoomController(this.usersDb);
    this.users = new AuthController(this.usersDb, this.room.updateRoom());
    this.boards = new BoardsController(this.usersDb);
  }

  runController(
    type: Commands,
    data: TBoardsControlData | IUserData | IRoomReqData | string,
    socketId: string,
  ) {
    switch (type) {
      case Commands.REG_USER:
        return this.users.auth(type, data as IUserData, socketId);
      case Commands.CREATE_ROOM:
      case Commands.ADD_USER_TO_ROOM:
        return this.room.run(type, data as IRoomReqData, socketId);
      case Commands.ADD_SHIPS:
      case Commands.ATTACK:
      case Commands.RANDOM_ATTACK:
        return this.boards.run(type, data as TBoardsControlData, socketId);
      case Commands.SINGLE_PLAY:
        return this.startBot(socketId);
      case Commands.DISCONNECT:
        return this.disconnectSocket(socketId);
      default:
        return;
    }
  }

  private disconnectSocket(socketId: string) {
    const user = this.usersDb.getUserBySocket(socketId);
    const room = user && this.room.eventDisconnect(user.name);
    const boardData = user && this.boards.eventDisconnect(user.index);

    if (room) return room;
    if (boardData) return boardData;
  }

  private startBot(socketId: string) {
    const user = this.usersDb.getUserBySocket(socketId);
    if (user) {
      const botId = user.index + 1;
      const botName = BOT_DATA.name + this.usersDb.getUsersCount();
      const userBot = {
        socketId,
        name: botName,
        password: BOT_DATA.password,
        index: botId,
      };
      const getBot = this.usersDb.getUserById(botId);

      if (!getBot) {
        this.usersDb.createUser(userBot);
        this.usersDb.addWinner({ name: userBot.name, wins: 0 });
      } else {
        this.usersDb.updateUser({ ...userBot, socketId });
      }

      const roomUsers = [
        { name: userBot.name, index: userBot.index },
        { name: user.name, index: user.index },
      ];
      const room = this.room.eventBot(user.name, roomUsers);
      const game = room.find((arr) => arr.type === Commands.CREATE_GAME)?.data;
      const gameId = (game as ICreateGame).idGame;

      const botData: IShipsData = {
        gameId,
        ships: BOT_SHIPS,
        indexPlayer: userBot.index,
      };

      this.boards.eventBot(botData, socketId);
      return room;
    }
  }
}
