export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Ball {
  x: number;
  y: number;
  velX: number;
  velY: number;
}

export interface Dir {
  vertical: string;
  horizontal: string;
}
export interface GameInfo {
  ball: Ball;
  paddleLeft: Paddle;
  paddleRight: Paddle;
  bounds: { width: number; height: number };
  scoreLeft: number;
  scoreRight: number;
  dir: Dir;
  roundId?: number;
}

export interface Room {
  tournamentId?: number;
  roundId?: number;
  type?: string;
  gameId: string;
  player1?: string;
  player2?: string;
  ready: boolean;
  gameInfo: GameInfo;
  intervalId?: NodeJS.Timer | undefined;
  leftPlayer?:number;
  rightPlayer?:number;
  startedAt?: Date;
  scoreLeft?: number;
  scoreRight?: number;
  winner?: string | undefined;
  round?: number;
}

export interface Player {
  id: string;
  socketId?: string;
  joinedAt: Date;
  username?: string;
  rating?: number;
  avatar: string;
}

export interface Game {
  id: string;
  player1: Player;
  player2: Player;
  status: "waiting" | "active" | "finished";
  createdAt: Date;
  gameInfo: GameInfo;
}

export interface Tournament {
  players: number[];
  createdAt: Date;
  status: "open" | "started" | "full";
  admin: number;
  name: string;
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 18;
const PADDLE_HEIGHT = 120;

export const DefaultGame: GameInfo = {
  ball: {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    velX: 300,
    velY: 120,
  },
  paddleLeft: {
    x: 24,
    y: (GAME_HEIGHT - PADDLE_HEIGHT) / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  },
  paddleRight: {
    x: GAME_WIDTH - 24 - PADDLE_WIDTH,
    y: (GAME_HEIGHT - PADDLE_HEIGHT) / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  },
  bounds: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scoreLeft: 0,
  scoreRight: 0,
  dir: {
    vertical: "default",
    horizontal: "default",
  },
};

export interface gameCustomization {
  gameBorder: string;
  gameShadow: string;
  ballColor: string;
  ballShadow: string;
  paddleColor: string;
  paddleBorder: string;
  paddleShadow: string;
  paddleSpeed: number;
  selectedBg: string;
}
