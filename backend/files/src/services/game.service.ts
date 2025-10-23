import { DefaultGame, type GameInfo, type Room } from "../models/game.js";

import { clients, checkPaddleCollision } from "./game.utils.js";
import app from "../server.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { v4 as uuidv4 } from "uuid";

//todo
//fix the final score in tournament
const rooms: Room[] = [];
// const rounds:Round[] = [];

function set_random_Info(game_info: GameInfo) {
  const ballx = game_info.bounds.width / 2;
  const bally = game_info.bounds.height / 2;
  const angle = (Math.random() * Math.PI) / 3 - Math.PI / 6;
  const dir = Math.random() > 0.5 ? 1 : -1;
  const velX = dir * Math.cos(angle) * 200;
  const velY = Math.sin(angle) * 200;
  game_info.dir.vertical = velY < 0 ? "up" : "down";
  game_info.dir.horizontal = velX < 0 ? "left" : "right";
  game_info.ball = { x: ballx, y: bally, velX, velY };
  return game_info;
}

function saveData(room: Room) {
  if (!room.winner) return;
  if (room.tournamentId) {
    room.round = app.db.prepare("SELECT round_number  FROM ROUND WHERE tournament_id = ? AND round_number =  ?").get(room.tournamentId, 2)?.round_number;
  }
  if (room.tournamentId) {
    try {
      // app.db.prepare("INSERT INTO ROUND ( tournament_id, player1, player2, winner) VALUES ( (SELECT id FROM TOURNAMENT WHERE game_id = ?), ?, ?, ?)")
      // .run( room.gameId, room.player1, room.player2, room.winner);
      const score = room.round == 2 ? 300 : 100;
      app.db.prepare("UPDATE players SET score = score + ? WHERE id = ?").run(score, room.winner);
      app.db
        .prepare("UPDATE Round SET score1 = ?, score2 = ?, winner = ? WHERE id = ?")
        .run(room.scoreLeft, room.scoreRight, room.winner, room.roundId);
      if (room.round == 2) app.db.prepare("UPDATE tournament SET status = ? WHERE id = ?").run("finished", room.tournamentId);
      console.log("-- Round registred successfully", room.type);
    } catch (err) {
      console.log(err);
    }
  }
  try {
    app.db
      .prepare("INSERT INTO Room(player1, player2, scoreLeft, scoreRight, winner) VALUES (?, ?, ?, ?, ?)")
      .run(room.player1, room.player2, room.scoreLeft, room.scoreRight, room.winner);

    app.db.prepare("UPDATE players SET score = score + ? WHERE id = ?").run(100, room.winner);
    console.log("-- Room registred successfully");
  } catch (err) {
    console.log(err);
  }
}

export const getData = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const history_rooms: Room[] = app.db.prepare("SELECT * FROM Room").all() as Room[];
    console.log("-- history rooms :", history_rooms);
    res.status(200).send({ data: history_rooms });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
function gameLoop(room: Room) {
  var game = room.gameInfo;
  if (room.roundId) room.gameInfo.roundId = room.roundId;
  const dt = 1 / 60;

  const nx = game.ball.x + game.ball.velX * dt;
  const ny = game.ball.y + game.ball.velY * dt;

  if (ny + 10 >= DefaultGame.bounds.height && game.dir.vertical === "down") {
    game.ball.velY *= -1;
    game.dir.vertical = "up";
  }
  if (ny - 10 <= 0 && game.dir.vertical === "up") {
    game.ball.velY *= -1;
    game.dir.vertical = "down";
  }
  if (game.ball.velX < 0 && game.dir.horizontal === "left" && checkPaddleCollision(game.paddleLeft, nx, ny)) {
    const intersectY = (ny - (game.paddleLeft.y + DefaultGame.paddleLeft.height / 2)) / (DefaultGame.bounds.height / 2);
    const speed = Math.hypot(game.ball.velX, game.ball.velY);
    const newAngle = intersectY * (Math.PI / 3);
    const newSpeed = Math.min(900, speed * 1.02);

    game.ball.velX = Math.cos(newAngle) * newSpeed;
    game.ball.velY = Math.sin(newAngle) * newSpeed;
    game.dir = {
      vertical: game.ball.velY < 0 ? "up" : "down",
      horizontal: "right",
    };
  }
  if (game.ball.velX > 0 && game.dir.horizontal === "right" && checkPaddleCollision(game.paddleRight, nx, ny)) {
    const intersectY = (ny - (game.paddleRight.y + DefaultGame.paddleRight.height / 2)) / (DefaultGame.bounds.height / 2);
    const speed = Math.hypot(game.ball.velX, game.ball.velY);
    const newAngle = Math.PI - intersectY * (Math.PI / 3);
    const newSpeed = Math.min(900, speed * 1.5);
    game.ball.velX = Math.cos(newAngle) * newSpeed;
    game.ball.velY = -Math.sin(newAngle) * newSpeed;
    game.dir = {
      vertical: game.ball.velY < 0 ? "up" : "down",
      horizontal: "left",
    };
    game.dir.horizontal = "left";
  }
  if (nx < -10) {
    game.scoreRight++;
    game = set_random_Info(game);
    return;
  }
  if (nx > DefaultGame.bounds.width + 10) {
    game.scoreLeft++;
    game = set_random_Info(game);
    return;
  }
  game.ball.x = nx;
  game.ball.y = ny;
  room.gameInfo = game;
  if (game.scoreLeft > 1) room.winner = room.player1;
  else if (game.scoreRight > 1) room.winner = room.player2;
  if (room.winner) {
    broadcastToRoom(room, { type: "end", winner: room.winner });
    room.scoreLeft = game.scoreLeft;
    room.scoreRight = game.scoreRight;
    saveData(room);
    console.log("-- game ended the winner is ", room.winner);
    if (room.intervalId) {
      clearInterval(room.intervalId);
      room.intervalId = undefined;
    }
    if (room.tournamentId) {
      const index = rooms.findIndex((r) => r.roundId === room.roundId);
      if (index !== -1) {
        rooms.splice(index, 1);
        console.log(`Round ${room.roundId} removed from tournament list. ${room.tournamentId}`);
      }
    } else {
      const index = rooms.findIndex((r) => r.gameId === room.gameId);
      if (index !== -1) {
        rooms.splice(index, 1);
        console.log(`Room ${room.gameId} removed from rooms list.`);
      }
    }
  }
  broadcastToRoom(room, { type: "update", game_info: room.gameInfo });
}

function broadcastToRoom(room: Room, message: any) {
  [room.player1, room.player2].forEach((pid) => {
    if (!pid) return;
    const conn = clients.get(pid);
    if (conn) {
      conn.send(JSON.stringify(message));
    }
  });
}

function startGame(room: Room) {
  if (room.intervalId) return;
  room.intervalId = setInterval(() => gameLoop(room), 1000 / 60);
}

export function handleGameConnection(connection: any, req: any) {
  let userId: string;

  connection.on("message", (message: any) => {
    try {
      const msg = JSON.parse(message.toString());
      if (msg.userId)
        console.log("-- msg: ", msg);
      if (msg.type === "casual") {
        userId = msg.userId;
        clients.set(userId, connection);
        addPlayerToRoom(msg.gameId, Number(userId), msg.side);
        console.log("-- connectionn established with ", userId);
      } else if (msg.type === "tournament") {
        userId = msg.userId;
        clients.set(userId, connection);
        addPlayerToRound(Number(msg.tournamentId), userId, Number(msg.roundNumber), msg.side);
        // console.log("data received", msg);
        return;
      }

      if (msg.type === "updateY") {
        // console.log("--- entred", rooms)
        const room = getRoom(msg.gameId, msg.roundId);
        if (!room) console.log("room not found");
        else {
          if (msg.side == "left") room.gameInfo.paddleLeft.y = msg.leftY;
          if (msg.side == "right") room.gameInfo.paddleRight.y = msg.rightY;
          console.log("Broadcasting to room:", room.gameId, "Players:", room.player1, room.player2, "type: ", room.type);

          broadcastToRoom(room, { type: "updateY", game_info: room.gameInfo });
        }
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

function getRoom(gameId: string, roundId: number): Room {
  var room;
  if (roundId) room = rooms.find((r) => r.roundId === roundId);
  if (!room) room = rooms.find((r) => r.gameId === gameId);
  const id = gameId ? gameId : uuidv4();
  if (!room) {
    room = {
      roundId: roundId,
      gameId: id,
      ready: false,
      gameInfo: set_random_Info(structuredClone(DefaultGame)),
    };
    rooms.push(room);
  }
  return room;
}



function addPlayerToRoom(gameId: string, playerId: number, side: string) {
  if (!playerId)
      return ;
    const room = getRoom(gameId, 0);

  if (!room.leftPlayer && side === "left") {
    room.leftPlayer = playerId;
    console.log(`Assigned ${playerId} as left player`);
    wait_opponent(room, 10, room.rightPlayer);
      if (room.waitTimer && room.rightPlayer) {
        clearTimeout(room.waitTimer);
        room.waitTimer = null;
        console.log("-- Opponent joined in time, timer cleared.");
      }
  } else if (!room.rightPlayer && room.rightPlayer !== playerId && side === "right") {
    room.rightPlayer = playerId;
    console.log(`Assigned ${playerId} as right player`);
    wait_opponent(room, 10, room.leftPlayer);
    if (room.waitTimer && room.leftPlayer) {
      clearTimeout(room.waitTimer);
      room.waitTimer = null;
      console.log("-- Opponent joined in time, timer cleared.");
    }
  } else {
    console.log("Player already in room or room full:", playerId);
  }
  
  if (room.leftPlayer && room.rightPlayer && !room.ready) {
    room.player1 = String(room.leftPlayer);
    room.player2 = String(room.rightPlayer);
    room.ready = true;
    room.winner = undefined;
    room.startedAt = new Date();
    room.type = "casual";
    console.log(`-- Room ${room.gameId} ready! Players: left: ${room.player1}, right: ${room.player2}`);
    broadcastToRoom(room, {
            type: "start",
          });
    startGame(room);
  } else {
    console.log(`-- Waiting for another player in room gameId: ${gameId}`);
  }
}

function wait_opponent(room: Room, time: number, opponent: number | undefined) {
  if (!room.waitTimer) {
    console.log("-- Starting 10s wait timer for opponent...");
    room.waitTimer = setTimeout(() => {
          if (!opponent) {
            console.log("-- Opponent did not join in time, ending game.");
            if (!room.roundId) {
              console.log("set players ids")
              room.player1 = String (room.leftPlayer);
              room.player2 = String (room.rightPlayer);
            }
            broadcastToRoom(room, {
              type: "game_end",
            });
            if (room.roundId)
            {
              room.winner = room.player1 ? room.player1 : room.player2;
              console.log(`player ${room.winner} rb7 b forfait`);
              saveData(room);
              deleteRound(room.roundId)
            }
            else 
              deleteGame(room.gameId);
          }
        }, time * 1000);
  } else {
    console.log("player already waiting ")
  }
}

function addPlayerToRound(tournamentId: number, playerId: string, rn: number, side: string) {
  if (!playerId)
      return ;
  console.log(`looking for userId: ${playerId} in tid: ${tournamentId} rn : ${rn}`);

  const lastRound = app.db
    .prepare(
      `
      SELECT * FROM Round
      WHERE tournament_id = ?
      AND (player1 = ? OR player2 = ?)
      AND round_number = ?
      `
    )
    .get(tournamentId, playerId, playerId, rn);

  if (!lastRound) {
    console.log("No round found for player:", playerId);
    return;
  }

  const room = getRoom("", lastRound.id);
  console.log("round Id found:", room.roundId);
  room.tournamentId = tournamentId;
  room.type = "tournament";

  if (playerId != lastRound.player1 && playerId != lastRound.player2) {
    console.log("--- This is not your round:", playerId);
    return;
  }

  if (!room.player1 && side === "left") {
    room.player1 = playerId;
    console.log("Assigned as player1:", playerId);

    wait_opponent(room, 10, Number (room.player2));
    if (room.waitTimer && room.player2) {
      clearTimeout(room.waitTimer);
      room.waitTimer = null;
      console.log("-- Opponent joined in time, timer cleared.");
    }
  } else if (!room.player2 && room.player1 !== playerId && side === "right") {
    room.player2 = playerId;
    console.log("Assigned as player2:", playerId);

    wait_opponent(room, 10, Number (room.player1));
    if (room.waitTimer && room.player1) {
      clearTimeout(room.waitTimer);
      room.waitTimer = null;
      console.log("-- Opponent joined in time, timer cleared.");
    }
  } else {
    console.log("Player already in room or room full:", playerId);
  }

  if (room.player1 && room.player2 && !room.ready) {
    room.ready = true;
    room.winner = undefined;
    room.startedAt = new Date();
    console.log(`-- Round ${tournamentId} ready! Players: ${room.player1}, ${room.player2}`);
    broadcastToRoom(room, {
      type: "start",
    });
    startGame(room);
  } else {
    console.log(`-- Waiting for another player in room tourId: ${tournamentId}`);
  }
}

function deleteRound(roundId: number): void {
  const index = rooms.findIndex((room) => room.roundId === roundId);

  if (index === -1) {
    console.log(`No room found with roundId: ${roundId}`);
    return;
  }

  const room = rooms[index];

  if (room?.waitTimer) {
    clearTimeout(room.waitTimer);
  }

  rooms.splice(index, 1);
  console.log(` Room with roundId ${roundId} deleted successfully.`);
}

function deleteGame(gameId: string): void {
  const index = rooms.findIndex((room) => room.gameId === gameId);

  if (index === -1) {
    console.log(`No room found with gameId: ${gameId}`);
    return;
  }

  const room = rooms[index];

  if (room?.waitTimer) {
    clearTimeout(room.waitTimer);
  }

  rooms.splice(index, 1);
  console.log(` Room with gameid${gameId} deleted successfully.`);
}

