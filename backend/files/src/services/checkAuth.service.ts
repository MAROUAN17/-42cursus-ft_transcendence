import type { FastifyReply, FastifyRequest } from "fastify";

export const checkAuth = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(200).send({ message: "LOGGED_IN" });
    res.status(401).send({ error: "NOT LOGGED_IN" });
  } catch (error) {
    return res.status(500).send({ error: "Unexpected error occurred" });
  }
};
