import type { FastifyReply, FastifyRequest } from "fastify";
import app from "../server.js";

export const checkAuth = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (accessToken && refreshToken)
      return res.status(200).send({ message: "Already logged in" });
    res.status(401).send({ message: "Not logged in yet" });
  } catch (error) {
    res.status(500).send({ error: error });
  }
};
