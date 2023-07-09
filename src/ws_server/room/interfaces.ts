interface IUserRoom {
  name: string;
  index: string;
}

interface IRoomData {
  roomId: string;
  roomUsers: IUserRoom[] | [];
}

interface IRoomReqData {
  indexRoom: string;
}

interface ICreateGame {
  idGame: string;
  idPlayer: string;
}

type TRoomsData = IUserRoom | IRoomData | IRoomData[] | ICreateGame;

interface IRoomService {
  getRoom(roomId: string): IRoomData | undefined;
  getRoomByUserName(userName: string): IRoomData | undefined;
  getAllRooms(): IRoomData[];
  createRoom(data: IRoomData): IRoomData;
  updateUsersInRoom(roomId: string, users: IUserRoom): IRoomData[];
  deleteRoom(roomId: string): IRoomData[];
}

interface IRoom {
  type: string;
  data: TRoomsData;
  id: string;
}

interface IRoomControl {
  run(type: string, data: IRoomReqData, socketId: string): void;
  updateRoom(roomId?: string, userRoom?: IUserRoom): void;
}

export {
  IRoomService,
  IRoomData,
  IUserRoom,
  IRoomControl,
  IRoom,
  IRoomReqData,
};
