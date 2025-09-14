import type {FastifyReply, FastifyRequest} from "fastify"
import type { Tournament } from "../models/game.js";
import app from "../server.js";



export const create_tournament = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const playerId = Number(req.headers['player-id']);
    const tName = (req.body as any)?.name;

    if (!playerId|| !tName)
      return res.status(400).send({ error: "Missing player info" });
    const tournament : Tournament = {
      players: [playerId],
      createdAt: new Date(),
      status: "open",
      admin: playerId,
      name: tName
    }
    const stmt = app.db.prepare(`
        INSERT INTO Tournament (name, players, createdAt, status, admin)
        VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
        tournament.name,
        JSON.stringify(tournament.players),
        tournament.createdAt.toISOString(),
        tournament.status,
        tournament.admin
    );
    console.log(`Tournament ${tournament} created sucessfully`);

    res.status(200).send({msg:`Tournament ${tournament} created sucessfully`});
  } catch (err: any) {
    console.error(err);
    return res.status(500).send({ error: "Failed to create tournament" });
  }
};

export const join_tournament = async (req: FastifyRequest, res: FastifyReply) => {
  const playerId = Number(req.headers["player-id"]);
  const tournamentId = Number((req.body as any)?.tournamentId);

  if (!playerId || !tournamentId)
    return res.status(400).send({ error: "Missing player info" });

  const tournament = app.db
    .prepare("SELECT * FROM Tournament WHERE id = ?")
    .get(tournamentId);

  if (!tournament)
    return res.status(404).send({ error: "Tournament not found" });

  const players: number[] = JSON.parse(tournament.players);

  if (players.includes(playerId))
    return res.status(400).send({ error: "Player already joined" });

  if (players.length >= 4)
    return res.status(400).send({ error: "Tournament is full" });

  players.push(playerId);

  const newStatus = players.length >= 4 ? "full" : tournament.status;

  app.db
    .prepare("UPDATE Tournament SET players = ?, status = ? WHERE id = ?")
    .run(JSON.stringify(players), newStatus, tournamentId);

  return res.send({ success: true, players, status: newStatus });
};


export const get_tournaments = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const tournaments = app.db.prepare("SELECT * FROM Tournament").all();

    const resData = tournaments.map((t: any) => ({
      ...t,
      players: JSON.parse(t.players),
      createdAt: new Date(t.createdAt)
    }));

    return res.send(resData);
  } catch (err) {
    console.error("Error fetching tournaments:", err);
    return res.status(500).send({ error: "Failed to fetch tournaments" });
  }
};

export const delete_tournament = async (req: FastifyRequest, res: FastifyReply) => {
  const tournamentId = Number((req.body as any)?.tournamentId);

  if (!tournamentId)
    return res.status(400).send({ error: "Missing tournamentId" });

  try {
    const result = app.db
      .prepare("DELETE FROM Tournament WHERE id = ?")
      .run(tournamentId);

    if (result.changes === 0)
      return res.status(404).send({ error: "Tournament not found" });

    return res.send({ success: true, deletedId: tournamentId });
  } catch (err) {
    console.error("Error deleting tournament:", err);
    return res.status(500).send({ error: "Failed to delete tournament" });
  }
};

export const leave_tournament = async (req: FastifyRequest, res: FastifyReply) => {
  const playerId = Number(req.headers["player-id"]);
  const tournamentId = Number((req.body as any)?.tournamentId);

  if (!playerId || !tournamentId)
    return res.status(400).send({ error: "Missing player info" });

  const tournament = app.db
    .prepare("SELECT * FROM Tournament WHERE id = ?")
    .get(tournamentId);

  if (!tournament)
    return res.status(404).send({ error: "Tournament not found" });

  let players: number[] = JSON.parse(tournament.players);

  if (!players.includes(playerId))
    return res.status(400).send({ error: "Player not in tournament" });

  players = players.filter((id) => id !== playerId);

  if (players.length === 0) {
    app.db.prepare("DELETE FROM Tournament WHERE id = ?").run(tournamentId);
    return res.send({ success: true, msg: "Tournament deleted (no players left)" });
  }

  let newStatus = tournament.status;
  if (tournament.status === "full" && players.length < 4) {
    newStatus = "open";
  }

  app.db
    .prepare("UPDATE Tournament SET players = ?, status = ? WHERE id = ?")
    .run(JSON.stringify(players), newStatus, tournamentId);

  return res.send({ success: true, players, status: newStatus });
};

