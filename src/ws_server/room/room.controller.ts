import { v4 as uuidv4 } from 'uuid';
import { Commands } from '../constants';
import { AuthService } from '../auth/auth.service';
import { IUserData } from '../auth/interfaces';
import { RoomService } from './room.service';
import { IRoom, IRoomControl, IRoomReqData, IUserRoom } from './interfaces';

export class RoomController implements IRoomControl {
  private users: AuthService;
  private roomDb: RoomService;
  private currentUser: undefined | IUserData;
  private currentSocketId: string;

  constructor(usersDb: AuthService) {
    this.users = usersDb;
    this.roomDb = new RoomService();
    this.currentUser = undefined;
    this.currentSocketId = '';
  }

  run(type: string, reqData: IRoomReqData, socketId: string) {
    const { indexRoom } = reqData;

    this.currentSocketId = socketId;
    this.currentUser = this.users.getUserBySocket(socketId);

    switch (type) {
      case Commands.CREATE_ROOM:
        return this.createRoom();
      case Commands.ADD_USER_TO_ROOM:
        return this.addUserToRoom(indexRoom);
      default:
        return;
    }
  }

  private createRoom() {
    const roomId = uuidv4();
    const roomUsers: IUserRoom[] = [];

    if (this.currentUser) {
      const { name, index } = this.currentUser;
      const getRoom = this.roomDb.getRoomByUserName(name);

      if (!getRoom) {
        this.roomDb.createRoom({ roomId, roomUsers });

        const userRoom = { name, index };
        return this.updateRoom(roomId, userRoom);
      }

      return this.updateRoom();
    }

    return this.updateRoom();
  }

  updateRoom(roomId?: string, userRoom?: IUserRoom): IRoom {
    const type = Commands.UPDATE_ROOM;
    const data =
      roomId && userRoom
        ? this.roomDb.updateUsersInRoom(roomId, userRoom)
        : this.roomDb.getAllRooms();

    return { type, data, id: this.currentSocketId };
  }

  private addUserToRoom(roomId: string) {
    const getRoom = this.roomDb.getRoom(roomId);

    if (getRoom && this.currentUser) {
      const { roomUsers } = getRoom;
      const { name, index } = this.currentUser;
      const checkUserInRoom = roomUsers.some((user) => user.index === index);
      const getRoomEnemy = this.roomDb.getRoomByUserName(name);

      if (!checkUserInRoom) {
        this.updateRoom(roomId, { name, index });
        const usersRoom = this.roomDb.getRoom(roomId);

        if (usersRoom) {
          const { roomUsers } = usersRoom;
          const idGame = uuidv4();

          const players = (roomUsers as IUserRoom[]).reduce<IRoom[]>(
            (acc, { index }) => {
              const sockedId = this.users.getSocketId(index);
              if (sockedId) {
                acc.push(this.createGame(index, idGame, sockedId));
              }
              return acc;
            },
            [],
          );

          const deleteRoom = this.destroyRoom(roomId, getRoomEnemy?.roomId);
          return [...players, deleteRoom];
        }
      }
    }

    return this.updateRoom();
  }

  private createGame(
    idPlayer: string,
    idGame: string,
    socketId: string,
  ): IRoom {
    const type = Commands.CREATE_GAME;
    const data = { idGame, idPlayer };

    return { type, data, id: socketId };
  }

  private destroyRoom(roomId: string, roomIdEnemy?: string) {
    const type = Commands.UPDATE_ROOM;

    if (roomIdEnemy) {
      this.roomDb.deleteRoom(roomIdEnemy);
    }

    const data = this.roomDb.deleteRoom(roomId);
    return { type, data, id: this.currentSocketId };
  }
}
