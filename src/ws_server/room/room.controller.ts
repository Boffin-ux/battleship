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

  run(type: Commands, reqData: IRoomReqData, socketId: string) {
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
          const players = this.createGame(roomUsers);
          const deleteRoom = this.destroyRoom(roomId, getRoomEnemy?.roomId);
          return [...players, deleteRoom];
        }
      }
    }

    return this.updateRoom();
  }

  private createGame(roomUsers: IUserRoom[]): IRoom[] {
    const idGame = uuidv4();
    const type = Commands.CREATE_GAME;

    return roomUsers.reduce<IRoom[]>((acc, { index }) => {
      const data = { idGame, idPlayer: index };
      const socketId = this.users.getSocketId(index);
      if (socketId) {
        acc.push({ type, data, id: socketId });
      }
      return acc;
    }, []);
  }

  private destroyRoom(roomId: string, roomIdEnemy?: string) {
    roomIdEnemy && this.roomDb.deleteRoom(roomIdEnemy);
    this.roomDb.deleteRoom(roomId);

    return this.updateRoom();
  }

  eventDisconnect(userName: string) {
    const getRoom = this.roomDb.getRoomByUserName(userName);
    return getRoom && this.destroyRoom(getRoom?.roomId);
  }

  eventBot(userName: string, roomUsers: IUserRoom[]) {
    const room = this.eventDisconnect(userName);
    const game = this.createGame(roomUsers);
    return room ? [room, ...game] : game;
  }
}
