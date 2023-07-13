import WebSocket, { WebSocketServer } from 'ws';
import { IWsServer } from './interfaces';
import { CommandsGame } from './commandsGame';
import { Commands, MESSAGE } from './constants';
import { v4 as uuidv4 } from 'uuid';

interface IWebSocket extends WebSocket {
  id: string;
}

export class WsServer implements IWsServer {
  webSocket: WebSocketServer;
  controllers: CommandsGame;

  constructor(port: number) {
    this.webSocket = new WebSocketServer({ port });
    this.controllers = new CommandsGame();
  }

  run() {
    console.log(`${MESSAGE.WS_CONNECT} ${this.webSocket.options.port}!`);

    this.webSocket.on('connection', (ws: IWebSocket) => {
      const wsId = uuidv4();
      ws.id = wsId;
      console.log(`${MESSAGE.CLIENT_CONNECT} ${wsId}!`);

      ws.on('message', (rawData: string) => {
        const { type, data } = this.parseData(rawData);
        const convertData = this.controllers.runController(type, data, wsId);

        if (convertData instanceof Array) {
          this.sendMsgSockets(convertData);
        } else if (convertData) {
          const convertToStr = this.toStringData(convertData);
          ws.send(convertToStr);

          if (type === Commands.CREATE_ROOM) {
            this.webSocket.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(convertToStr);
              }
            });
          }
        }
      });

      ws.on('close', () => console.log(`${MESSAGE.CLIENT_EXIT} ${wsId}!`));
      ws.on('error', (err) => console.log('err:', err));
    });

    this.stopServer();
  }

  private sendMsgSockets(convertData) {
    for (const playerData of convertData) {
      const convertToStr = this.toStringData(playerData);

      if (
        playerData.type === Commands.UPDATE_ROOM ||
        playerData.type === Commands.UPDATE_WINNERS
      ) {
        this.webSocket.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(convertToStr);
          }
        });
      } else {
        this.webSocket.clients.forEach((client) => {
          if (
            (client as IWebSocket).id === playerData.id &&
            client.readyState === WebSocket.OPEN
          ) {
            client.send(convertToStr);
          }
        });
      }
    }
  }

  private toStringData(convertData) {
    const { type, data, id } = convertData;
    const resData = JSON.stringify(data);
    return JSON.stringify({ type, data: resData, id });
  }

  private parseData(rawData: string) {
    const { type, data, id } = JSON.parse(rawData);
    const convertData = data.length ? JSON.parse(data) : data;

    return { type, data: convertData, id };
  }

  private stopServer() {
    process.on('SIGINT', () => {
      this.webSocket.close(() => console.log(MESSAGE.WS_EXIT));
      process.exit();
    });
  }
}
