import WebSocket, { WebSocketServer } from 'ws';
import { IWsServer } from './interfaces';
import { MESSAGE } from './constants';
import { v4 as uuidv4 } from 'uuid';

interface IWebSocket extends WebSocket {
  id: string;
}

export class WsServer implements IWsServer {
  webSocket: WebSocketServer;

  constructor(port: number) {
    this.webSocket = new WebSocketServer({ port });
  }

  run() {
    console.log(`${MESSAGE.WS_CONNECT} ${this.webSocket.options.port}!`);

    this.webSocket.on('connection', (ws: IWebSocket) => {
      const wsId = uuidv4();
      ws.id = wsId;
      console.log(`${MESSAGE.CLIENT_CONNECT} ${wsId}!`);

      ws.on('message', (rawData: string) => {
        //todo
      });

      ws.on('close', () => console.log(`${MESSAGE.CLIENT_EXIT} ${wsId}!`));
      ws.on('error', (err: Event) => console.log(err));
    });

    this.stopServer();
  }

  private stopServer() {
    process.on('SIGINT', () => {
      this.webSocket.close(() => console.log(MESSAGE.WS_EXIT));
      process.exit();
    });
  }
}
