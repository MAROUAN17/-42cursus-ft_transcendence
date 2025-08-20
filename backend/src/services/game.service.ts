
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
  
    broadcast(msgPacket);
  }, 1000 / 60);
}

export function handleGameConnection(connection: any, req: any) {
  const id: string = uuidv4();
  clients.set(id, connection);
  console.log("Connection established with =>", id);
  
  gameLoop();
  
  connection.on("message", (message: any) => {
    console.log(`Received from ${id}:`, message.toString());
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
  if (msg.type == "vely"){
    //if (msgPacket.game_info.ball.y  < 0 )
    //  msgPacket.game_info.ball.y = 10;
    //else
    //  msgPacket.game_info.ball.y = 990;
    msgPacket.game_info.ball.y *=-1
  }
  else 
    msgPacket.game_info.ball.velX *= -1;

  if (msg.type == "score")
  {
    console.log("WHO received:",msg.who);
    if (msg.who == "right")
      msgPacket.game_info.scoreRight++
    else
      msgPacket.game_info.scoreLeft++
    const ballx = msgPacket.game_info.bounds.width / 2;
    const bally = msgPacket.game_info.bounds.height / 2;
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
    const dir = Math.random() > 0.5 ? 1 : -1;
    const velX = dir  * Math.cos(angle) * 2 ;
    const velY =  Math.sin(angle) * 4;

    msgPacket.game_info.ball = {x: ballx, y:bally, velX:velX, velY:velY}
    console.log("new Ball info: ", msgPacket.game_info.ball)
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
