//this the file where we define our plugins
import os from "os";
import fs from "fs";
import Database from "better-sqlite3";
import app from "../server.js";

export async function dbConnection () {
    const db = new Database('/app/db/app.db');

    app.decorate("db", db);
    app.addHook("onClose", (fastify, done) => {
        db.close();
        done();
    })
}