import type { GameInfo, Paddle } from "../models/game.js";

export const clients = new Map<string, any>();

export function broadcast(message: any) {
  //console.log("Broadcasting to clients...");
  for (const [id, conn] of clients) {
    //console.log("->", id);
    //if (conn.readyState === WebSocket.OPEN) {
      conn.send(JSON.stringify(message));
    //}
  }
}

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
