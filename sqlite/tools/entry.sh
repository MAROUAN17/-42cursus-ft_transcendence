#! /bin/bash

DB_PATH="$HOME/goinfre/db_data/"
DB_NAME="app.db"

touch $DB_NAME

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
        reset_token TEXT,
        logged_in BOOLEAN DEFAULT FALSE,
        online BOOLEAN DEFAULT FALSE,
        friends JSON DEFAULT '[]',
        block_list JSON DEFAULT '[]',
        first_login BOOLEAN DEFAULT TRUE,
        score INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY,
        sender_id INTEGER NOT NULL,
        recipient_id INTEGER NOT NULL,
        message text NOT NULL,
        type TEXT DEFAULT "message",
        isAccepted BOOLEAN DEFAULT FALSE,
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
        startedAt TEXT DEFAULT (datetime('now')),
        score1 INTEGER DEFAULT 0,
        score2 INTEGER DEFAULT 0,
        winner INTEGER,
        round_number INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS Settings (
        id INTEGER PRIMARY KEY,
        userId INTEGER NOT NULL,
        paddleSpeed INTEGER DEFAULT 8,
        gameBorder TEXT DEFAULT '#B13BFF', 
        gameShadow TEXT DEFAULT '#B13BFF',
        ballColor TEXT DEFAULT '#B13BFF',
        ballShadow TEXT DEFAULT '#B13BFF',
        paddleColor TEXT DEFAULT '#ffffff',
        paddleBorder TEXT DEFAULT '#B13BFF',
        paddleShadow TEXT DEFAULT '#B13BFF',
        selectedBg TEXT DEFAULT '/gameBg1.jpg'
    );
EOF


tail -f /dev/null;