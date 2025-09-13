import type {FastifyReply, FastifyRequest} from "fastify"
import type {Tournament, Player } from "../generated/prisma/index.js"
import app from "../server.js";


const tournaments: Tournament[] = [];

export const create_tournament = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const playerId = req.headers["player-id"] as string;
    const username = (req.body as any)?.username;

    if (!playerId || !username) {
      return res.status(400).send({ error: "Missing player info" });
    }

    app.db.prepare(
      `INSERT OR IGNORE INTO players (id, username) VALUES (?, ?)`
    ).run(playerId, username);

    const players: Player[] = app.db.prepare(`SELECT * FROM players`).all();

    if (players.length < 2) {
      return res
        .status(200)
        .send({ message: "Waiting for more players to join..." });
    }

    const round = 1;
    const matches: any[] = [];
    for (let i = 0; i < players.length; i += 2) {
      if (i + 1 >= players.length) break;
      const match = app.db
        .prepare(
          `INSERT INTO Room (round, player1, player2) VALUES (?, ?, ?)`
        )
        .run(round, players[i]?.id, players[i + 1]?.id);

      matches.push({
        id: match.lastInsertRowid,
        round,
        player1: players[i],
        player2: players[i + 1],
      });
    }

    return res.status(201).send({
      message: "Tournament round created",
      matches,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send({ error: "Failed to create tournament" });
  }
};