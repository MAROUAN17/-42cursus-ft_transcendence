import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";
import type { gameCustomization } from "../models/game.js";
import type { Payload } from "../models/chat.js";

export const updateCustomization = async (req: FastifyRequest<{ Body: gameCustomization }>, res: FastifyReply) => {
  try {
    const token = req.cookies.accessToken!;
    const payload = app.jwt.jwt1.verify(token) as Payload;
    console.log("req -> ", req.body);
    let { gameBorder, gameShadow, ballColor, ballShadow, paddleColor, paddleBorder, paddleShadow, paddleSpeed, selectedBg } = req.body;
    const updatedRow = app.db
      .prepare(
        "UPDATE settings SET gameBorder = ?, gameShadow = ?, ballColor = ?, ballShadow = ?, paddleColor = ?, paddleBorder = ?, paddleShadow = ?, paddleSpeed = ?, selectedBg = ? WHERE userId = ?"
      )
      .run(gameBorder, gameShadow, ballColor, ballShadow, paddleColor, paddleBorder, paddleShadow, paddleSpeed, selectedBg, payload.id);
    res.status(200).send();
  } catch (err) {
    console.log("error -> ", err);
    res.status(500).send({ error: err });
  }
};
export const getCustomization = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token = req.cookies.accessToken!;
    const payload = app.jwt.jwt1.verify(token) as Payload;
    const row = app.db
      .prepare(
        "SELECT gameBorder, gameShadow, ballColor, ballShadow, paddleColor, paddleBorder, paddleShadow, paddleSpeed, selectedBg FROM settings WHERE userId = ?"
      )
      .get(payload.id);
    res.status(200).send(row);
  } catch (err) {
    console.log("error -> ", err);
    res.status(500).send({ error: err });
  }
};
