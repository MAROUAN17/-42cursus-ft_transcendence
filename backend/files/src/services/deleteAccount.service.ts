import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";
import type { Payload } from "../models/chat.js";

export const deleteAccount = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token = req.cookies.accessToken;
    const payload = app.jwt.jwt1.verify(token) as Payload;
    // delete photo later
    const updatedRow = app.db
      .prepare(
        "UPDATE players SET username = 'Deleted User', \
        intra_id = NULL, avatar = './deleted.png', \
        email = '', password = NULL, secret_otp = NULL,\
        reset_flag = FALSE, reset_time = NULL,\
        logged_in = FALSE, friends = '[]',\
        block_list = '[]' WHERE id = ?"
      )
      .run(payload.id);
    if (updatedRow.changes == 0) return res.status(404).send({ error: "User Not Found!" });
    res.status(200).send();
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
