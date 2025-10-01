#! /bin/bash

DB_PATH="$HOME/goinfre/db_data/"
DB_NAME="app.db"

# mkdir -p $DB_PATH
# cd $DB_PATH
touch $DB_NAME
#chmod 777 $DB_PATH$DB_NAME
sqlite3 "$DB_NAME" <<EOF 
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY,
        intra_id INTEGER,
        avatar TEXT DEFAULT '/profile1.jpg',
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT,
        secret_otp TEXT,
        reset_flag BOOLEAN,
        reset_time INTEGER,
        logged_in BOOLEAN DEFAULT FALSE,
        online BOOLEAN DEFAULT FALSE,
        twoFA_verify BOOLEAN DEFAULT FALSE,
        friends JSON DEFAULT '[]',
        block_list JSON DEFAULT '[]',
        first_login BOOLEAN DEFAULT TRUE
    );
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY,
        sender_id INTEGER NOT NULL,
        recipient_id INTEGER NOT NULL,
        message text NOT NULL,
        isRead BOOLEAN DEFAULT FALSE,
        createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY,
        type TEXT NOT NULL,
        sender_id INTEGER NOT NULL,
        recipient_id INTEGER NOT NULL,
        message TEXT,
        unreadCount INTEGER DEFAULT 0,
        isRead BOOLEAN DEFAULT FALSE,
        updatedAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS Room (
        id INTEGER PRIMARY KEY,
        player1 TEXT,
        player2 TEXT,
        startedAt TEXT DEFAULT (datetime('now')),
        scoreLeft INTEGER,
        scoreRight INTEGER,
        winner TEXT
    );
    CREATE TABLE IF NOT EXISTS Tournament (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        players TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        status TEXT NOT NULL,
        admin INTEGER NOT NULL  
    );

    INSERT INTO players(username, email, password, secret_otp) VALUES ("user1", "user1@gmail.com", '\$2b\$10\$rqCwxklFfV6lllny4.6WMOIw2yGUyDXGdc7AD6LzUlh.KDe.UJwlu', "GULGAWRACMRFOLBK");
    INSERT INTO players(username, email, password, secret_otp) VALUES ("user2", "user2@gmail.com", '\$2b\$10\$rqCwxklFfV6lllny4.6WMOIw2yGUyDXGdc7AD6LzUlh.KDe.UJwlu', "GULGAWRACMRFOLBK");
    INSERT INTO players(username, email, password, secret_otp) VALUES ("user3", "user3@gmail.com", '\$2b\$10\$rqCwxklFfV6lllny4.6WMOIw2yGUyDXGdc7AD6LzUlh.KDe.UJwlu', "GULGAWRACMRFOLBK");
    INSERT INTO players(username, email, password, secret_otp) VALUES ("user4", "user4@gmail.com", '\$2b\$10\$rqCwxklFfV6lllny4.6WMOIw2yGUyDXGdc7AD6LzUlh.KDe.UJwlu', "GULGAWRACMRFOLBK");



EOF

tail -f /dev/null;