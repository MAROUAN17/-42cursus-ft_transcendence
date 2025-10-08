import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";
import type { Payload } from "../models/chat.js";

export const getPersonalData = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token = req.cookies.accessToken;
    const payload = app.jwt.jwt1.verify(token) as Payload;
    const userRow = app.db.prepare("SELECT username, avatar, email, friends, block_list, score FROM players WHERE id = ?").run(payload.id);
    if (userRow.changes == 0) return res.status(404).send({ error: "User Not Found!" });
    const fileData = JSON.stringify(userRow, null, 2);
    const filename: string = payload.username + "_userData.json";
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(fileData);
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
