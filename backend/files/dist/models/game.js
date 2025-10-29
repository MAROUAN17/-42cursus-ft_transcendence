const GAME_WIDTH = 1200;
const GAME_HEIGHT = 700;
const PADDLE_WIDTH = 18;
const PADDLE_HEIGHT = 120;
export const DefaultGame = {
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
//# sourceMappingURL=game.js.map