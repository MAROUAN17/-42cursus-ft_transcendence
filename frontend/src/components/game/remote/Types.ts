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
  }
  