import { IRoomData, IRoomService, IUserRoom } from './interfaces';

export class RoomService implements IRoomService {
  private rooms: IRoomData[];

  constructor() {
    this.rooms = [];
  }

  getRoom(roomId: string): IRoomData | undefined {
    const room = this.rooms.find((room) => room.roomId === roomId);
    return room;
  }

  getRoomByUserName(userName: string): IRoomData | undefined {
    const room = this.rooms.find(({ roomUsers }) => {
      return roomUsers.some((user) => user.name === userName);
    });
    return room;
  }

  getAllRooms(): IRoomData[] {
    return this.rooms;
  }

  createRoom(data: IRoomData): IRoomData {
    this.rooms.push(data);
    return data;
  }

  deleteRoom(roomId: string): IRoomData[] {
    this.rooms.splice(
      this.rooms.findIndex((room) => room.roomId === roomId),
      1,
    );
    return this.rooms;
  }

  updateUsersInRoom(roomId: string, user: IUserRoom): IRoomData[] {
    const room = this.getRoom(roomId);
    if (room && user) {
      room.roomUsers = [...room.roomUsers, user];
    }

    return this.rooms;
  }
}
