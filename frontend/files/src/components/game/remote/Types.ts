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

export interface GameInfo {
  ball: Ball;
  paddleLeft: Paddle;
  paddleRight: Paddle;
  bounds: { width: number; height: number };
  scoreLeft: number;
  scoreRight: number;
  roundId?: number;
}

export interface PaddlY {
  leftY: number;
  rightY: number;
  rLeftY: number;
  rRightY: number;
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
  id?: string;
  opponent?: Player;
  you?: Player;
  side: string;
  gameInfo?: GameInfo;
  round?:Round;
}

export interface Round {
  id: number;
  tournament_id: number;
  player1: number;
  player2: number;
  score1: number;
  score2: number;
  winner: number;
  round_number: number;
  status:string;
}