
import { DefaultGame, type GameInfo } from "../models/game.js";

import { v4 as uuidv4 } from "uuid";
import { type MessagePacket } from "../types/game.js";
import { clients, broadcast } from "./game.utils.js"; 

const msgPacket: MessagePacket = {
  to: "me",
  game_info: DefaultGame
};

function gameLoop () {
  setInterval(() => {
    msgPacket.game_info.ball.x += msgPacket.game_info.ball.velX;
    msgPacket.game_info.ball.y += msgPacket.game_info.ball.velY;
  
    if (
      msgPacket.game_info.ball.y <= 0 ||
      msgPacket.game_info.ball.y >= DefaultGame.bounds.height
    ) {
      msgPacket.game_info.ball.velY *= -1;
    }
  
    if (
      msgPacket.game_info.ball.x <= 0 ||
      msgPacket.game_info.ball.x >= DefaultGame.bounds.width
    ) {
      msgPacket.game_info.ball.velX *= -1;
    }
  
    broadcast(msgPacket);
  }, 1000 / 60);
}

export function handleGameConnection(connection: any, req: any) {
  const id: string = uuidv4();
  clients.set(id, connection);
  console.log("Connection established with =>", id);
  
  gameLoop();
  
  connection.on("game_info", (message: any) => {
    console.log(`Received from ${id}:`, message.toString());
    try {
      const clientConn = clients.get(msgPacket.to);
      if (clientConn) clientConn.send(msgPacket.game_info);
    } catch (err) {
      console.error("Invalid game info packet:", err);
    }
  });

  connection.on("close", () => {
    console.log("Client disconnected ->", id);
    clients.delete(id);
  });
}


export const getGameState = () => {
  return DefaultGame;
};

export const updateGameState = (updates: Partial<typeof DefaultGame>) => {
  Object.assign(DefaultGame, updates);
  return DefaultGame;
};

export const moveBall = () => {
  DefaultGame.ball.x += 2;
  return DefaultGame;
};
