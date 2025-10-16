import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";
import type { gameCustomization } from "../models/game.js";
import type { Payload } from "../models/chat.js";

export const updateCustomization = async (req: FastifyRequest<{ Body: gameCustomization }>, res: FastifyReply) => {
  try {
    const token = req.cookies.accessToken!;
    const payload = app.jwt.jwt1.verify(token) as Payload;
    const regex: RegExp = /^#[0-9A-Z]{6}/i;
    let { gameBorder, gameShadow, ballColor, ballShadow, paddleColor, paddleBorder, paddleShadow, paddleSpeed, selectedBg } = req.body;
    const validBg = ["/gameBg1.jpg", "/gameBg2.jpg", "/gameBg3.jpg", "/gameBg4.jpg", "/gameBg5.jpg", "/gameBg6.jpg"];
    if (
      paddleSpeed < 1 ||
      paddleSpeed > 6 ||
      !regex.test(gameBorder) ||
      !regex.test(gameShadow) ||
      !regex.test(ballColor) ||
      !regex.test(ballShadow) ||
      !regex.test(paddleColor) ||
      !regex.test(paddleBorder) ||
      !regex.test(paddleShadow) ||
      !validBg.includes(selectedBg)
    )
      throw new Error("Invalid Body");
    const updatedRow = app.db
      .prepare(
        "UPDATE settings SET gameBorder = ?, gameShadow = ?, ballColor = ?, ballShadow = ?, paddleColor = ?, paddleBorder = ?, paddleShadow = ?, paddleSpeed = ?, selectedBg = ? WHERE userId = ?"
      )
      .run(gameBorder, gameShadow, ballColor, ballShadow, paddleColor, paddleBorder, paddleShadow, Number(paddleSpeed) + 6, selectedBg, payload.id);
    res.status(200).send();
  } catch (err) {
    res.status(500).send({ error: "Error updating Customizations" });
  }
};
export const getCustomization = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token = req.cookies.accessToken!;
    const payload = app.jwt.jwt1.verify(token) as Payload;
    const row: gameCustomization = app.db
      .prepare(
        "SELECT gameBorder, gameShadow, ballColor, ballShadow, paddleColor, paddleBorder, paddleShadow, paddleSpeed, selectedBg FROM settings WHERE userId = ?"
      )
      .get(payload.id);
    row.paddleSpeed -= 6;
    console.log("sent -> ", row);
    res.status(200).send(row);
  } catch (err) {
    console.log("error -> ", err);
    res.status(500).send({ error: err });
  }
};
