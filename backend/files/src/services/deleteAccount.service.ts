import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";
import type { Payload } from "../models/chat.js";
import fs from "fs";

export const deleteAccount = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token = req.cookies.accessToken;
    const payload = app.jwt.jwt1.verify(token) as Payload;
    const defaultAvatars = ["/profile1.jpg", "/profile2.jpg", "/profile3.jpg", "/profile4.jpg", "/profile5.jpg", "/profile6.jpg"];
    const user = app.db.prepare("SELECT avatar FROM players WHERE id = ?").get(payload.id);
    if (!user) return res.status(404).send({ error: "User Not Found!" });
    if (!defaultAvatars.includes(user.avatar)) {
      fs.unlink("/app/uploads/" + user.avatar, (err) => {
      });
    }
    const tournaments = app.db
      .prepare("SELECT id, players, admin, status FROM tournament WHERE players LIKE '%' || ? || '%'")
      .all(payload.id.toString());
    for (const row of tournaments) {
      let players = JSON.parse(row.players);
      let newStatus = row.status;
      if (row.status == "finished") continue;
      if (players.includes(payload.id.toString())) {
        players = players.filter((id: string) => id != payload.id.toString());
        if (players.length == 0 || row.admin == payload.id) {
          app.db.prepare("DELETE FROM Tournament WHERE id = ?").run(row.id);
          continue;
        }
        if (row.status === "full" && players.length < 4) {
          newStatus = "open";
        }
        app.db.prepare("UPDATE Tournament SET players = ?, status = ? WHERE id = ?").run(JSON.stringify(players), newStatus, row.id);
      }
    }
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
    res.status(500).send({ error: "Unkown Error" });
  }
};
