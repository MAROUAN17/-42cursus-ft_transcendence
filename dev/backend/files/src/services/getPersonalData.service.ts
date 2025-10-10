import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";
import type { Payload } from "../models/chat.js";

function getNames(str: string): string[] {
  const list = JSON.parse(str);
  const holder = list.map((id: string) => "?").join(", ");
  const names: string[] = app.db
    .prepare(`SELECT username FROM players WHERE id IN (${holder})`)
    .all(list)
    .map((u: { username: string }) => (u.username != "Deleted User" ? u.username : null));
  return names;
}

export const getPersonalData = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token = req.cookies.accessToken;
    const payload = app.jwt.jwt1.verify(token) as Payload;
    const userRow = app.db.prepare("SELECT username, avatar, email, friends, block_list, score FROM players WHERE id = ?").get(payload.id);
    if (userRow) {
      userRow.friends = getNames(userRow.friends);
      userRow.block_list = getNames(userRow.block_list);
      const fileData = JSON.stringify(userRow, null, 2);
      const filename: string = payload.username + "_userData.json";
      res.header("Content-Disposition", `attachment; filename="${filename}"`);
      res.header("Content-Type", "application/json");
      res.status(200).send(fileData);
    } else res.status(404).send({ error: "User Not Found!" });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
