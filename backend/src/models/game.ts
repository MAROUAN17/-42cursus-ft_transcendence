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
  
  const GAME_WIDTH = 600;
  const GAME_HEIGHT = 400;
  const PADDLE_WIDTH = 18;
  const PADDLE_HEIGHT = 200;
  
  export const DefaultGame: GameInfo = {
    ball: {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      velX: 5, 
      velY: 5
    },
    paddleLeft: {
      x: 24,
      y: (GAME_HEIGHT - PADDLE_HEIGHT) / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT
    },
    paddleRight: {
      x: GAME_WIDTH - 24 - PADDLE_WIDTH,
      y: (GAME_HEIGHT - PADDLE_HEIGHT) / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT
    },
    bounds: {
      width: GAME_WIDTH,
      height: GAME_HEIGHT
    },
    scoreLeft: 0,
    scoreRight: 0
  };