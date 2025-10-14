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
        twoFA_verify BOOLEAN DEFAULT FALSE,
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

    INSERT INTO players(username, email, password) VALUES ("user1", "user1@gmail.com", '\$2b\$10\$rqCwxklFfV6lllny4.6WMOIw2yGUyDXGdc7AD6LzUlh.KDe.UJwlu');
    INSERT INTO players(username, email, password) VALUES ("user2", "user2@gmail.com", '\$2b\$10\$rqCwxklFfV6lllny4.6WMOIw2yGUyDXGdc7AD6LzUlh.KDe.UJwlu');
    INSERT INTO players(username, email, password) VALUES ("user3", "user3@gmail.com", '\$2b\$10\$rqCwxklFfV6lllny4.6WMOIw2yGUyDXGdc7AD6LzUlh.KDe.UJwlu');
    INSERT INTO players(username, email, password) VALUES ("user4", "user4@gmail.com", '\$2b\$10\$rqCwxklFfV6lllny4.6WMOIw2yGUyDXGdc7AD6LzUlh.KDe.UJwlu');
    
    INSERT INTO Settings(userId) VALUES (1);
    INSERT INTO Settings(userId) VALUES (2);
    INSERT INTO Settings(userId) VALUES (3);
    INSERT INTO Settings(userId) VALUES (4);

    # Random match history data
    INSERT INTO Room(player1, player2, scoreLeft, scoreRight, winner) VALUES (1, 2, 30, 11, 1);
    INSERT INTO Room(player1, player2, scoreLeft, scoreRight, winner) VALUES (1, 3, 20, 11, 3);
    INSERT INTO Room(player1, player2, scoreLeft, scoreRight, winner) VALUES (2, 1, 25, 11, 2);
    INSERT INTO Room(player1, player2, scoreLeft, scoreRight, winner) VALUES (4, 1, 25, 11, 4);
    INSERT INTO Room(player1, player2, scoreLeft, scoreRight, winner) VALUES (3, 1, 22, 15, 1);
EOF


tail -f /dev/null;