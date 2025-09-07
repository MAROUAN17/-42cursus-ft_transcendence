
import { DefaultGame, type GameInfo } from "../models/game.js";

import { v4 as uuidv4 } from "uuid";
import { type MessagePacket } from "../types/game.js";
import { clients, broadcast, checkPaddleCollision } from "./game.utils.js"; 


const msgPacket: MessagePacket = {
  to: "me",
  game_info: set_random_Info(DefaultGame)
};

function set_random_Info(game_info:GameInfo) {
  const ballx = game_info.bounds.width / 2;
  const bally = game_info.bounds.height / 2;
  const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
  const dir = Math.random() > 0.5 ? 1 : -1; 
  const velX = dir * Math.cos(angle) * 200;
  const velY = Math.sin(angle) * 200;
  game_info.dir.vertical = velY < 0 ? "up" : "down";
  game_info.dir.horizontal= velX < 0 ? "left" : "right";
  game_info.ball = { x: ballx, y: bally, velX, velY };
  return game_info;
}

function gameLoop () {
  let last = Date.now();

  setInterval(() => {
    const now = Date.now();
    const dt = Math.min(32, now - last) / 1000; 
    last = now;

    const nx = msgPacket.game_info.ball.x + msgPacket.game_info.ball.velX * dt
    const ny = msgPacket.game_info.ball.y + msgPacket.game_info.ball.velY * dt

    if (ny + 10 >= DefaultGame.bounds.height && msgPacket.game_info.dir.vertical === "down"){
      msgPacket.game_info.ball.velY *= -1;
      msgPacket.game_info.dir.vertical = "up";
    }
    if (ny - 10 <= 0 && msgPacket.game_info.dir.vertical === "up"){
      msgPacket.game_info.ball.velY *= -1
      msgPacket.game_info.dir.vertical = "down";
    }
    if (msgPacket.game_info.ball.velX < 0 
      && msgPacket.game_info.dir.horizontal === "left" 
      && checkPaddleCollision(msgPacket.game_info.paddleLeft, nx, ny))
      {
        const intersectY = (ny - (msgPacket.game_info.paddleLeft.y + DefaultGame.paddleLeft.height/ 2)) / (DefaultGame.bounds.height / 2);
        const speed = Math.hypot(msgPacket.game_info.ball.velX, msgPacket.game_info.ball.velY);
        const newAngle = intersectY * (Math.PI / 3);
        const newSpeed = Math.min(900, speed * 1.1);
        
        msgPacket.game_info.ball.velX =  Math.cos(newAngle) * newSpeed ;
        msgPacket.game_info.ball.velY =  Math.sin(newAngle) * newSpeed ;
        msgPacket.game_info.dir = {
          vertical:msgPacket.game_info.ball.velY < 0 ? "up" : "down",
          horizontal: "right"
        }
      }
    if (msgPacket.game_info.ball.velX > 0 
      && msgPacket.game_info.dir.horizontal === "right" 
      && checkPaddleCollision(msgPacket.game_info.paddleRight, nx, ny))
      {
        const intersectY = (ny - (msgPacket.game_info.paddleRight.y + DefaultGame.paddleRight.height/ 2)) / (DefaultGame.bounds.height / 2);
        const speed = Math.hypot(msgPacket.game_info.ball.velX, msgPacket.game_info.ball.velY);
        const newAngle = Math.PI - intersectY * (Math.PI / 3);
        const newSpeed = Math.min(900, speed * 1.1);
        msgPacket.game_info.ball.velX =  Math.cos(newAngle) * newSpeed ;
        msgPacket.game_info.ball.velY =  -Math.sin(newAngle) * newSpeed ;
        msgPacket.game_info.dir = {
          vertical:msgPacket.game_info.ball.velY < 0 ? "up" : "down",
          horizontal: "left"
        }
        msgPacket.game_info.dir.horizontal = "left";
      }
    msgPacket.game_info.ball.x = nx;
    msgPacket.game_info.ball.y = ny;

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
  
    msgPacket.game_info = set_random_Info(msgPacket.game_info);
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
