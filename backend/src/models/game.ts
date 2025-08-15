export interface Position {
    x: number;
    y: number;
}

export interface Paddle {
    y: number;
}

export interface GameState {
    bounds: { width: number; height: number };
    leftPaddle: Paddle;
    rightPaddle: Paddle;
    ballPos: Position;
    ballVel: Position;
    scoreLeft: number;
    scoreRight: number;
}

export const gameState: GameState = {
    bounds: { width: 800, height: 400 },
    leftPaddle: { y: 140 },
    rightPaddle: { y: 140 },
    ballPos: { x: 400, y: 200 },
    ballVel: { x: 300, y: 120 },
    scoreLeft: 0,
    scoreRight: 0
};
