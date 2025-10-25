import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";
import { v4 as uuidv4 } from "uuid";
import type { LogPacket } from "../models/webSocket.model.js";

function fetchLoser(id: number) {
  const loser = app.db.prepare("SELECT username FROM players WHERE id = ?").get(id);
  return loser?.username ?? "undefined";
}

function fetchTournament(id: number) {
  const loser = app.db.prepare("SELECT name FROM tournament WHERE id = ?").get(id);
  return loser.name;
}

export const getLogs = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const history = app.db
      .prepare(
        "SELECT * from (SELECT tournament_id , startedAt, players.avatar, round.winner, round.player1, round.player2, players.username, 'Round' AS source FROM round JOIN players ON players.id = round.winner WHERE winner != '0' \
        AND round_number = 2 UNION ALL SELECT 'room' AS tournament_id ,startedAt, players.avatar, room.winner, room.player1, room.player2, players.username,'room' AS source FROM room JOIN players ON players.id = room.winner WHERE winner != '0') \
        ORDER BY startedAt DESC LIMIT 6"
      )
      .all();
    console.log("games -> ", history);
    const logs: LogPacket[] = history.map((row: any) => ({
      type: "logNotif",
      data: {
        id: uuidv4(),
        is_removed: false,
        winner: row.username,
        loser: row.winner == row.player1 ? fetchLoser(row.player2) : fetchLoser(row.player1),
        game_type: row.source == "Round" ? "tournament" : "1v1",
        tournament_name: row.source == "Round" ? fetchTournament(row.tournament_id) : "",
        avatar: row.avatar,
        timestamps: row.startedAt,
      },
    }));
    // console.log(logs)
    res.status(200).send(logs);
  } catch (err) {
    console.log("error -> ", err);
    res.status(500).send({ error: err });
  }
};
