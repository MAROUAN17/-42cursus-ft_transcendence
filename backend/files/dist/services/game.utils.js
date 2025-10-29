export const clients = new Map();
export const checkPaddleCollision = (paddle, nx, ny) => {
    const ballRect = {
        left: nx - 10,
        right: nx + 10,
        top: ny - 10,
        bottom: ny + 10,
    };
    if (!paddle)
        return false;
    const paddleRect = {
        left: paddle.x,
        right: paddle.x + paddle.width,
        top: paddle.y,
        bottom: paddle.y + paddle.height,
    };
    return !(ballRect.right < paddleRect.left ||
        ballRect.left > paddleRect.right ||
        ballRect.bottom < paddleRect.top ||
        ballRect.top > paddleRect.bottom);
};
//# sourceMappingURL=game.utils.js.map