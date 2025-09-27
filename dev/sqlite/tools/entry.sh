#! /bin/bash

DB_PATH="/mnt/c/Users/moham/OneDrive/Desktop/goinfre/db_data/"
DB_NAME="app.db"

# mkdir -p $DB_PATH
# cd $DB_PATH
touch $DB_NAME
#chmod 777 $DB_PATH$DB_NAME

sqlite3 "$DB_NAME" <<EOF 
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY,
        intra_id INTEGER,
        avatar TEXT DEFAULT '/photo.png',
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT,
        secret_otp TEXT,
        reset_flag BOOLEAN,
        reset_time INTEGER,
        logged_in BOOLEAN DEFAULT FALSE,
        twoFA_verify BOOLEAN DEFAULT FALSE,
        friends JSON DEFAULT '[]',
        block_list JSON DEFAULT '[]'
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
        player1 INTEGER,
        player2 INTEGER,
        startedAt TEXT DEFAULT (datetime('now')),
        scoreLeft INTEGER,
        scoreRight INTEGER,
        winner INTEGER
    );
    CREATE TABLE IF NOT EXISTS Tournament (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        players TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        status TEXT NOT NULL,
        admin INTEGER NOT NULL  
    );
    CREATE TABLE IF NOT EXISTS Round (
        id INTEGER PRIMARY KEY,
        tournament_id INTEGER NOT NULL,
        player1 INTEGER,
        player2 INTEGER,
        score1 INTEGER DEFAULT 0,
        score2 INTEGER DEFAULT 0,
        winner INTEGER,
        round_number INTEGER NOT NULL
    );

EOF

tail -f /dev/null;