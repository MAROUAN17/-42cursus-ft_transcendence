//this the file where we define our plugins
import os from "os";
import fs from "fs";
import Database from "better-sqlite3";
import app from "../server.js";

export async function dbConnection () {
    const homeDir = os.homedir();
    const goinfrePath = homeDir + '/goinfre' + '/db_data' + '/app.db';
    const dbFile = fs.existsSync(homeDir + '/goinfre' + '/db_data' + '/app.db') ? goinfrePath : homeDir + '/app.db';
    // const dbFile = "C:\\Users\\moham\\OneDrive\\Desktop\\goinfre\\db_data\\app.db";

    const db = new Database(dbFile);

    console.log(db);

    app.decorate("db", db);
    app.addHook("onClose", (fastify, done) => {
        db.close();
        done();
    })
}