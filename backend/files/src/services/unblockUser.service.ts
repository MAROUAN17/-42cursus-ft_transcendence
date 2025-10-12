import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";
import type { Payload } from "../models/chat.js";

interface jsonObj {
  key: number;
}

export const unblockUser = async (req: FastifyRequest<{ Params: { id: number } }>, res: FastifyReply) => {
  try {
    const token = req.cookies.accessToken;
    const payload = app.jwt.jwt1.verify(token) as Payload;
    const checkBlocked: jsonObj = app.db
      .prepare("SELECT key FROM json_each((SELECT block_list FROM players WHERE id = ?)) WHERE value = ?")
      .get(payload.id, req.params.id);
    if (checkBlocked == undefined) return;
    const blockedUser = app.db
      .prepare("UPDATE players SET block_list = json_remove(block_list, '$[' || ? || ']') WHERE id = ?")
      .run(checkBlocked.key.toString(), payload.id);
    if (blockedUser.changes == 0) return res.status(404).send({ error: "Error" });
    res.status(200).send();
  } catch (err) {
    console.log("error ->", err);
    res.status(500).send({ error: err });
  }
};
