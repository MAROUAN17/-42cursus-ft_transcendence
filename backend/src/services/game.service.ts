
import { DefaultGame, type GameInfo } from "../models/game.js";

import { v4 as uuidv4 } from "uuid";
import { type MessagePacket } from "../types/game.js";
import { clients, broadcast } from "./game.utils.js"; 

const msgPacket: MessagePacket = {
  to: "me",
  game_info: DefaultGame
};

function gameLoop () {
  let last = Date.now();

setInterval(() => {
  const now = Date.now();
  const dt = Math.min(32, now - last) / 1000; 
  last = now;

  msgPacket.game_info.ball.x += msgPacket.game_info.ball.velX * dt;
  msgPacket.game_info.ball.y += msgPacket.game_info.ball.velY * dt;

  broadcast(msgPacket);
}, 1000 / 60);

}

export function handleGameConnection(connection: any, req: any) {
  const id: string = uuidv4();
  clients.set(id, connection);
  console.log("Connection established with =>", id);
  
  gameLoop();
  
  connection.on("message", (message: any) => {
    //console.log(`Received from ${id}:`, message.toString());
    try {
      const msg = JSON.parse(message.toString());
      updateInfo(msg)
      const clientConn = clients.get(msgPacket.to);
      if (clientConn) {
        clientConn.send(JSON.stringify(msgPacket.game_info));
      }
    } catch (err) {
      console.error("Invalid game info packet:", err);
    }
  });

  connection.on("close", () => {
    console.log("Client disconnected ->", id);
    clients.delete(id);
  });
}

function updateInfo(msg:any) {
  if (msg.type == "vely")
    msgPacket.game_info.ball.velY *=-1
  else if (msg.type == "velx")
    msgPacket.game_info.ball.velX *= -1;

  else if (msg.type == "score") {
    //console.log("WHO received:", msg.who);
    if (msg.who == "right") msgPacket.game_info.scoreRight++;
    else msgPacket.game_info.scoreLeft++;
  
    const ballx = msgPacket.game_info.bounds.width / 2;
    const bally = msgPacket.game_info.bounds.height / 2;
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
    const dir = Math.random() > 0.5 ? 1 : -1; 
    const velX = dir * Math.cos(angle) * 200;
    const velY = Math.sin(angle) * 200;
  
    msgPacket.game_info.ball = { x: ballx, y: bally, velX, velY };
    //console.log("new Ball info: ", msgPacket.game_info.ball);
  }
  else if (msg.type == "updateY"){
    msgPacket.game_info.paddleLeft.y = msg.leftY;
    msgPacket.game_info.paddleRight.y = msg.rightY;
  }
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
