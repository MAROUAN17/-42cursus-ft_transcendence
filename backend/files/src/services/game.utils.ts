import type {  Paddle } from "../models/game.js";

export const clients = new Map<string, any>();

export const checkPaddleCollision = (paddle:Paddle, nx:number , ny:number) => {
  const ballRect = {
    left: nx - 10,
    right: nx + 10,
    top: ny - 10,
    bottom: ny + 10,
  };
  if (!paddle) return false;
  const paddleRect = {
    left: paddle.x,
    right: paddle.x + paddle.width,
    top: paddle.y,
    bottom: paddle.y + paddle.height,
  };
  return !(
    ballRect.right < paddleRect.left ||
    ballRect.left > paddleRect.right ||
    ballRect.bottom < paddleRect.top ||
    ballRect.top > paddleRect.bottom
  );
};
