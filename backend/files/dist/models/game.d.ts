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
    bounds: {
        width: number;
        height: number;
    };
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
    leftPlayer?: number;
    rightPlayer?: number;
    startedAt?: Date;
    scoreLeft?: number;
    scoreRight?: number;
    winner?: string | undefined;
    round?: number;
    waitTimer?: NodeJS.Timeout | null;
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
    type?: string;
}
export interface Tournament {
    players: number[];
    createdAt: Date;
    status: "open" | "started" | "full";
    admin: number;
    name: string;
}
export declare const DefaultGame: GameInfo;
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
//# sourceMappingURL=game.d.ts.map