import Sensible from "@fastify/sensible";
import { type FastifyInstance, type FastifyPluginOptions } from "fastify"
import Database, { type Database as DatabaseType } from "better-sqlite3";
import app from "./index.js";
import os from "os";
import fs from "fs";


interface User {
    id: number,
    name: string
};

declare module 'fastify' {
  interface FastifyInstance {
    db: DatabaseType;
  }
}

async function dbConnection () {
    const homeDir = os.homedir();
    const goinfrePath = homeDir + '/goinfre' + '/db_data' + '/app.db';
    const dbFile = fs.existsSync(homeDir + '/goinfre' + '/db_data' + '/app.db') ? goinfrePath : homeDir + '/app.db';
    
    const db = new Database(dbFile);

    app.decorate("db", db);

    app.addHook("onClose", (fastify, done) => {
        db.close();
        done();
    })
}

export default async function App(fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
    app.register(Sensible);
    app.register(dbConnection);

    //GET users
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
