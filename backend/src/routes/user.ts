import { fastify, type FastifyPluginAsync } from "fastify";
import app from "../server.js"
import { type User } from "../models/user.js";

export const userRoutes: FastifyPluginAsync = async(fastify) => {
    //GET user
    app.route({
        method: "GET",
        url: "/users",
        handler: function reqHandler(req, res) {
            const rows: User[] = fastify.db.prepare('SELECT * FROM users').all() as User[];
            res.send({
                message: "data retrieved successfully",
                success: true,
                data: rows,
            })
        }
    })
}