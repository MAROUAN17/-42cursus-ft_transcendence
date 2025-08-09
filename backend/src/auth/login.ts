// import fp from "fastify-plugin";
// import Database, { type Database as DatabaseType } from "better-sqlite3";
// import os, { homedir } from "os";
// import fs from "fs";

// declare module 'fastify' {
//   interface FastifyInstance {
//     db: DatabaseType;
//   }
// }

// async function dbConnection () {
//     const homeDir = os.homedir();
//     const goinfrePath = homeDir + '/goinfre' + '/db_data' + '/app.db';
//     const dbFile = fs.existsSync(homeDir + '/goinfre' + '/db_data' + '/app.db') ? goinfrePath : homedir + '/app.db';
    
//     const db = new Database(dbFile);

//     fastify.decorate("db", db);

//     fastify.addHook("onClose", (fastify, done) => {
//         db.close();
//         done();
//     })
// }

// export default fp(dbConnection);
