import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";

export const get_profile = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const playerId = Number((req.params as any)?.playerId);
    if (!playerId) return res.status(400).send({ error: "Missing player id" });

    const matchesStmt = app.db.prepare(`
      SELECT COUNT(*) as total 
      FROM Room 
      WHERE player1 = ? OR player2 = ?
    `);
    const matchesPlayed = matchesStmt.get(playerId, playerId)?.total || 0;

    const winsStmt = app.db.prepare(`
      SELECT COUNT(*) as total 
      FROM Room 
      WHERE winner = ?
    `);
    const totalWins = winsStmt.get(playerId)?.total || 0;

    const winRatio = matchesPlayed > 0 ? (totalWins / matchesPlayed) : 0;

    const tournamentsStmt = app.db.prepare(`
      SELECT COUNT(*) as total 
      FROM Tournament t
      WHERE EXISTS (
        SELECT 1 FROM Round r
        WHERE r.tournament_id = t.id
        AND r.winner = ?
        AND r.round_number = (
          SELECT MAX(round_number) FROM Round WHERE tournament_id = t.id
        )
      )
    `);
    const tournamentsWon = tournamentsStmt.get(playerId)?.total || 0;

    const leaderboardStmt = app.db.prepare(`
      SELECT p.id, 
        (CAST(COALESCE(w.wins, 0) AS FLOAT) / 
         CASE WHEN m.matches > 0 THEN m.matches ELSE 1 END) as ratio
      FROM players p
      LEFT JOIN (
        SELECT winner as id, COUNT(*) as wins 
        FROM Room 
        GROUP BY winner
      ) w ON p.id = w.id
      LEFT JOIN (
        SELECT player_id as id, COUNT(*) as matches
        FROM (
          SELECT player1 as player_id FROM Room
          UNION ALL
          SELECT player2 as player_id FROM Room
        )
        GROUP BY player_id
      ) m ON p.id = m.id
      ORDER BY ratio DESC
    `);

    const leaderboard = leaderboardStmt.all();
    const rank = leaderboard.findIndex((p: any) => p.id === playerId) + 1;

    return res.status(200).send({
      playerId,
      matchesPlayed,
      winRatio,
      tournamentsWon,
      rank
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send({ error: "Failed to fetch profile data" });
  }
};


export const get_player_rooms = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const playerId = Number((req.params as any)?.playerId);
    if (!playerId) {
      return res.status(400).send({ error: "Missing player id" });
    }

    const stmt = app.db.prepare(`
      SELECT 
        r.id,
        r.startedAt,
        r.player1,
        p1.username as player1_name,
        r.player2,
        p2.username as player2_name,
        r.scoreLeft,
        r.scoreRight,
        r.winner,
        pw.username as winner_name
      FROM Room r
      LEFT JOIN players p1 ON r.player1 = p1.id
      LEFT JOIN players p2 ON r.player2 = p2.id
      LEFT JOIN players pw ON r.winner = pw.id
      WHERE r.player1 = ? OR r.player2 = ?
      ORDER BY datetime(r.startedAt) DESC
    `);

    const rooms = stmt.all(playerId, playerId);

    return res.status(200).send({
      playerId,
      rooms
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send({ error: "Failed to fetch rooms" });
  }
};


export const get_leaderboard = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const stmt = app.db.prepare(`
      SELECT 
        p.id,
        p.username,
        COALESCE(m.matches, 0) as matchesPlayed,
        COALESCE(w.wins, 0) as totalWins,
        CASE 
          WHEN COALESCE(m.matches, 0) > 0 
          THEN CAST(COALESCE(w.wins, 0) AS FLOAT) / m.matches
          ELSE 0 
        END as winRatio
      FROM players p
      LEFT JOIN (
        SELECT player_id as id, COUNT(*) as matches
        FROM (
          SELECT player1 as player_id FROM Room
          UNION ALL
          SELECT player2 as player_id FROM Room
        )
        GROUP BY player_id
      ) m ON p.id = m.id
      LEFT JOIN (
        SELECT winner as id, COUNT(*) as wins
        FROM Room
        WHERE winner IS NOT NULL
        GROUP BY winner
      ) w ON p.id = w.id
      ORDER BY winRatio DESC, totalWins DESC
    `);

    const leaderboard = stmt.all();

    const ranked = leaderboard.map((player: any, index: number) => ({
      rank: index + 1,
      ...player
    }));

    return res.status(200).send({ leaderboard: ranked });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send({ error: "Failed to fetch leaderboard" });
  }
};


export const get_player_week_activity = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const playerId = Number((req.params as any)?.playerId);
    if (!playerId) {
      return res.status(400).send({ error: "Missing player id" });
    }

    const dailyStmt = app.db.prepare(`
      SELECT DATE(startedAt) as day, COUNT(*) as matches
      FROM Room
      WHERE (player1 = ? OR player2 = ?)
      AND DATE(startedAt) >= DATE('now', '-6 days')
      GROUP BY DATE(startedAt)
      ORDER BY day ASC
    `);

    const dailyMatches = dailyStmt.all(playerId, playerId);

    const today = new Date();
    const last7Days: { day: string; matches: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayStr = d.toISOString().split("T")[0];

      const found = dailyMatches.find((m: any) => m.day === dayStr);
      last7Days.push({
        day: dayStr,
        matches: found ? found.matches : 0
      });
    }

    const totalMatches = last7Days.reduce((sum, d) => sum + d.matches, 0);

    return res.status(200).send({
      playerId,
      totalMatchesLast7Days: totalMatches,
      last7Days
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send({ error: "Failed to fetch player weekly activity" });
  }
};
