enum Commands {
  REG_USER = 'reg',
  CREATE_GAME = 'create_game',
  START_GAME = 'start_game',
  CREATE_ROOM = 'create_room',
  ADD_SHIPS = 'add_ships',
  UPDATE_ROOM = 'update_room',
  UPDATE_WINNERS = 'update_winners',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
  TURN = 'turn',
  FINISH = 'finish',
}

const MESSAGE = {
  WS_CONNECT: 'WebSocket server running on port',
  WS_EXIT: 'WebSocket server is closed',
  CLIENT_EXIT: 'Client is closed',
  CLIENT_CONNECT: 'Client connected',
  INVALID_PASSWORD: 'Invalid password',
  UNKNOWN_COMMAND: 'Unknown command',
  DATA_IS_NOT_VALID: 'User name or password should be Minimum 5 characters',
};

export { Commands, MESSAGE };
