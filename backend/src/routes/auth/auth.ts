//this is the file where we define all the routes of the app
import fp from "fastify-plugin";
import { type FastifyInstance, type FastifyPluginOptions } from "fastify"
import app from "../../server.js";

interface User {
    id: number,
    email: string
}
async function findUserHook(fastify: FastifyInstance, ops: FastifyPluginOptions): Promise<void> {
    app.decorate('findUserSource', {
        findUser: async(email: string) => {
            const user = app.db
                .prepare('SELECT * from users WHERE email ?')
                .get(email) as User[] | undefined;
            if (!user) {
                return null;
            }
            return user[0];
        }
    })
}

export default fp(findUserHook);

