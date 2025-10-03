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

    const resData = tournaments.map((t: any) => {
      const playerIds: number[] = JSON.parse(t.players);

      const players = playerIds.map((id) => {
        return app.db
          .prepare("SELECT id, username, score FROM players WHERE id = ?")
          .get(id);
      });

      return {
        ...t,
        players,
        createdAt: new Date(t.createdAt)
      };
    });

    return res.send(resData);
  } catch (err) {
    console.error("Error fetching tournaments:", err);
    return res.status(500).send({ error: "Failed to fetch tournaments" });
  }
};


export const get_tournament_by_id = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const tournamentId = Number((req.params as any)?.tournamentId);

    if (!tournamentId) {
      return res.status(400).send({ error: "Missing tournamentId" });
    }

    const tournament = app.db
      .prepare("SELECT * FROM Tournament WHERE id = ?")
      .get(tournamentId);

    if (!tournament) {
      return res.status(404).send({ error: "Tournament not found" });
    }

    const resData = {
      ...tournament,
      players: JSON.parse(tournament.players),
      createdAt: new Date(tournament.createdAt),
    };

    return res.send(resData);
  } catch (err) {
    console.error("Error fetching tournament:", err);
    return res.status(500).send({ error: "Failed to fetch tournament" });
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

export const start_tournament = async (req: FastifyRequest, res: FastifyReply) => {
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

  if (tournament.admin !== playerId)
    return res.status(403).send({ error: "Only admin can start the tournament" });

  if (players.length < 4)
    return res.status(400).send({ error: "Not enough players to start the tournament" });

  app.db
    .prepare("UPDATE Tournament SET status = ? WHERE id = ?")
    .run("ongoing", tournamentId);

  const rounds = [
    { tournament_id: tournamentId, player1: players[0], player2: players[1], round_number: 1 },
    { tournament_id: tournamentId, player1: players[2], player2: players[3], round_number: 1 },
  ];

  const insertRound = app.db.prepare(`
    INSERT INTO Round (tournament_id, player1, player2, round_number)
    VALUES (?, ?, ?, ?)
  `);

  const insertMany = app.db.transaction((rounds) => {
    for (const round of rounds) insertRound.run(round.tournament_id, round.player1, round.player2, round.round_number);
  });

  insertMany(rounds);

  return res.send({ success: true, msg: "Tournament started", rounds });
}


export const get_rounds = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const tournamentId = Number((req.params as any)?.tournamentId);
    
    if (!tournamentId) {
      return res.status(400).send({ error: "Missing tournamentId" });
    }
    const rounds = app.db
      .prepare("SELECT * FROM Round WHERE tournament_id = ?")
      .all(tournamentId);

    return res.send(rounds);
  } catch (err) {
    console.error("Error fetching rounds:", err);
    return res.status(500).send({ error: "Failed to fetch rounds" });
  }
};

export const report_match_result = async (req: FastifyRequest, res: FastifyReply) => {
  const playerId = Number(req.headers["player-id"]);
  const { roundId, score1, score2 } = req.body as { roundId: number; score1: number; score2: number; };

  if (!playerId || !roundId || score1 === undefined || score2 === undefined)
    return res.status(400).send({ error: "Missing match info" });

  const round = app.db
    .prepare("SELECT * FROM Round WHERE id = ?")
    .get(roundId);

  if (!round)
    return res.status(404).send({ error: "Round not found" });

  if (round.winner)
    return res.status(400).send({ error: "Match already reported" });

  if (round.player1 !== playerId && round.player2 !== playerId)
    return res.status(403).send({ error: "Only match players can report result" });

  let winner = null;
  if (score1 > score2) winner = round.player1;
  else if (score2 > score1) winner = round.player2;
  else return res.status(400).send({ error: "Match cannot end in a tie (ta3adol)" });

  app.db
    .prepare("UPDATE Round SET score1 = ?, score2 = ?, winner = ? WHERE id = ?")
    .run(score1, score2, winner, roundId);

  const tournamentId = round.tournament_id;
  const nextRoundNumber = round.round_number + 1;

  const nextRound = app.db
    .prepare("SELECT * FROM Round WHERE tournament_id = ? AND round_number = ? AND (player1 IS NULL OR player2 IS NULL)")
    .get(tournamentId, nextRoundNumber);

  if (nextRound) {
    if (!nextRound.player1) {
      app.db
        .prepare("UPDATE Round SET player1 = ? WHERE id = ?")
        .run(winner, nextRound.id);
    } else if (!nextRound.player2) {
      app.db
        .prepare("UPDATE Round SET player2 = ? WHERE id = ?")
        .run(winner, nextRound.id);
    }
  } else {
    const existingWinners = app.db
      .prepare("SELECT winner FROM Round WHERE tournament_id = ? AND round_number = ? AND winner IS NOT NULL")
      .all(tournamentId, round.round_number)
      .map((r: any) => r.winner);

    if (existingWinners.length === 2) {
      const insertRound = app.db.prepare(`
        INSERT INTO Round (tournament_id, player1, player2, round_number)
        VALUES (?, ?, ?, ?)
      `);
      insertRound.run(tournamentId, existingWinners[0], existingWinners[1], nextRoundNumber);
    }
  }

  const finalRound = app.db
    .prepare("SELECT * FROM Round WHERE tournament_id = ? AND round_number = ?")
    .all(tournamentId, nextRoundNumber);

  if (finalRound.length === 1 && finalRound[0].winner) {
    app.db
      .prepare("UPDATE Tournament SET status = ? WHERE id = ?")
      .run("completed", tournamentId);
  }

  return res.send({ success: true, msg: "Match result reported", winner });
}

export const get_tournament_winner = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const tournamentId = Number((req.params as any)?.tournamentId);
    
    if (!tournamentId) {
      return res.status(400).send({ error: "Missing tournamentId" });
    }
    const finalRound = app.db
      .prepare("SELECT * FROM Round WHERE tournament_id = ? ORDER BY round_number DESC LIMIT 1")
      .get(tournamentId);

    if (!finalRound || !finalRound.winner) {
      return res.status(404).send({ error: "Winner not determined yet" });
    }
    
    return res.send({ winner: finalRound.winner });
  }
  catch (err) {
    console.error("Error fetching tournament winner:", err);
    return res.status(500).send({ error: "Failed to fetch tournament winner" });
  }
};