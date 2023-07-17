import { IShips } from './interfaces';

enum ShotStatus {
  SHOT = 'shot',
  MISS = 'miss',
  KILLED = 'killed',
}

const BOT_SHIPS: IShips[] = [
  {
    position: { x: 1, y: 1 },
    direction: true,
    type: 'huge',
    length: 4,
  },
  {
    position: { x: 2, y: 6 },
    direction: true,
    type: 'large',
    length: 3,
  },
  {
    position: { x: 5, y: 8 },
    direction: false,
    type: 'large',
    length: 3,
  },
  {
    position: { x: 3, y: 1 },
    direction: true,
    type: 'medium',
    length: 2,
  },
  {
    position: { x: 6, y: 4 },
    direction: false,
    type: 'medium',
    length: 2,
  },
  {
    position: { x: 7, y: 1 },
    direction: false,
    type: 'medium',
    length: 2,
  },
  {
    position: { x: 6, y: 6 },
    direction: true,
    type: 'small',
    length: 1,
  },
  {
    position: { x: 8, y: 6 },
    direction: true,
    type: 'small',
    length: 1,
  },
  {
    position: { x: 4, y: 5 },
    direction: true,
    type: 'small',
    length: 1,
  },
  {
    position: { x: 5, y: 1 },
    direction: false,
    type: 'small',
    length: 1,
  },
];

const BOT_DATA = {
  name: 'BOT-00',
  password: 'BOT-00',
};

export { ShotStatus, BOT_SHIPS, BOT_DATA };
