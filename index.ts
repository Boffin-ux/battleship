import { httpServer } from './src/http_server/index';
import { WsServer } from './src/ws_server/index';

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WsServer(WS_PORT);
wsServer.run();
