export interface Player {
    id: string;
    name: string;
    score: number;
    positionY: number;
    velocityY: number;
}
export interface Ball {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    radius: number;
}
export interface GameBounds {
    width: number;
    height: number;
}
export interface GameState {
    id: string;
    players: [Player, Player];
    ball: Ball;
    bounds: GameBounds;
    isRunning: boolean;
    winner?: string;
}
//# sourceMappingURL=game.d.ts.map