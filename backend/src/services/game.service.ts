
import { DefaultGame, type GameInfo, type Room } from "../models/game.js";

import { clients, checkPaddleCollision } from "./game.utils.js"; 

const rooms:Room[] = [];

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

function gameLoop (room:Room)
{
  var game = room.gameInfo;
    const dt = 1 / 60; 
    

    const nx = game.ball.x + game.ball.velX * dt
    const ny = game.ball.y + game.ball.velY * dt

    if (ny + 10 >= DefaultGame.bounds.height && game.dir.vertical === "down"){
      game.ball.velY *= -1;
      game.dir.vertical = "up";
    }
    if (ny - 10 <= 0 && game.dir.vertical === "up"){
      game.ball.velY *= -1
      game.dir.vertical = "down";
    }
    if (game.ball.velX < 0 
      && game.dir.horizontal === "left" 
      && checkPaddleCollision(game.paddleLeft, nx, ny))
      {
        const intersectY = (ny - (game.paddleLeft.y + DefaultGame.paddleLeft.height/ 2)) / (DefaultGame.bounds.height / 2);
        const speed = Math.hypot(game.ball.velX, game.ball.velY);
        const newAngle = intersectY * (Math.PI / 3);
        const newSpeed = Math.min(900, speed * 1.02);
        
        game.ball.velX =  Math.cos(newAngle) * newSpeed ;
        game.ball.velY =  Math.sin(newAngle) * newSpeed ;
        game.dir = {
          vertical:game.ball.velY < 0 ? "up" : "down",
          horizontal: "right"
        }
      }
    if (game.ball.velX > 0 
      && game.dir.horizontal === "right" 
      && checkPaddleCollision(game.paddleRight, nx, ny))
      {
        const intersectY = (ny - (game.paddleRight.y + DefaultGame.paddleRight.height/ 2)) / (DefaultGame.bounds.height / 2);
        const speed = Math.hypot(game.ball.velX, game.ball.velY);
        const newAngle = Math.PI - intersectY * (Math.PI / 3);
        const newSpeed = Math.min(900, speed * 1.02);
        game.ball.velX =  Math.cos(newAngle) * newSpeed ;
        game.ball.velY =  -Math.sin(newAngle) * newSpeed ;
        game.dir = {
          vertical:game.ball.velY < 0 ? "up" : "down",
          horizontal: "left"
        }
        game.dir.horizontal = "left";
      }
    if (nx < -10) {
      game.scoreRight++;
      game = set_random_Info(game);
      return  ;
    }
    if (nx > DefaultGame.bounds.width + 10){
      game.scoreLeft++;
      game = set_random_Info(game);
      return ;
    }
    game.ball.x = nx;
    game.ball.y = ny;
    room.gameInfo = game;
    broadcastToRoom(room, { type: "update", game_info: room.gameInfo });
}


function broadcastToRoom(room: Room, message: any) {
  [room.player1, room.player2].forEach(pid => {
    if (!pid) return;
    const conn = clients.get(pid);
    if (conn) {
      conn.send(JSON.stringify(message));
    }
  });
}


function startGame (room:Room) {
  if (room.intervalId) return;
  room.intervalId = setInterval(() => gameLoop(room), 1000 / 60);
}

export function handleGameConnection(connection: any, req: any) {
  let userId: string ;

  connection.on("message", (message: any) => {
    try {
      const msg = JSON.parse(message.toString());

      if (msg.type === "newGame") {
        userId = msg.userId;
        clients.set(userId, connection);
        addPlayerToRoom(msg.gameId, userId);
        console.log('-- connectionn established with ', userId);
      }

      if (msg.type === "updateY") {
        const room = getRoom(msg.gameId);
        console.log("-- trying to update y for the game:", msg.gameId)
        console.log("Before update - Left Y:", room.gameInfo.paddleLeft.y, "Right Y:", room.gameInfo.paddleRight.y);
        console.log("Received values - leftY:", msg.leftY, "rightY:", msg.rightY);
        
        room.gameInfo.paddleLeft.y = msg.leftY;
        room.gameInfo.paddleRight.y = msg.rightY;
        
        console.log("After update - Left Y:", room.gameInfo.paddleLeft.y, "Right Y:", room.gameInfo.paddleRight.y);
        console.log("Broadcasting to room:", room.gameId, "Players:", room.player1, room.player2);
        
        broadcastToRoom(room, { type: "update", game_info: room.gameInfo });
      }
    } catch (err) {
      console.error("Invalid packet:", err);
    }
  });

  connection.on("close", () => {
    console.log("Client disconnected ->", userId);
    if (userId) clients.delete(userId);
  });

}
function getRoom(gameId: string): Room {
  let room = rooms.find(r => r.gameId === gameId);
  if (!room) {
    room = { 
      gameId, 
      ready: false, 
      gameInfo: set_random_Info(structuredClone(DefaultGame)) 
    };
    rooms.push(room);
  }
  return room;
}

function addPlayerToRoom(gameId: string, playerId: string) {
  const room = getRoom(gameId);

  if (!room.player1) {
    room.player1 = playerId;
  } else if (!room.player2 && room.player1 !== playerId) {
    room.player2 = playerId;
  }

  if (room.player1 && room.player2 && !room.ready) {
    room.ready = true;
    room.startedAt = new Date();
    console.log(`-- Room ${gameId} ready! Players: ${room.player1}, ${room.player2} at time ${room.startedAt}`);
    startGame(room);
  } else {
    console.log(`-- Waiting for another player in room ${gameId}`);
  }
}