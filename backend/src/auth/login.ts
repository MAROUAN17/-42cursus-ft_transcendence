import { server } from "../index.js";
import fp from "fastify-plugin";
import Database from "better-sqlite3";
import os from "os";
import path from "path";

async function dbConnection () {
    const homeDir = os.homedir();
    const dbFile = homeDir + '/goinfre' + '/db_data' + '/app.db';
    const db = new Database(dbFile);

    server.decorate("db", db);

    server.addHook("onClose", (fastify, done) => {
        db.close();
        done();
    })

    console.log("db connected successfully!!");
}

declare module 'fastify' {
  interface FastifyInstance {
    db: any;
  }
}

export default fp(dbConnection);
