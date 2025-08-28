#! /bin/bash

DB_PATH="$HOME/goinfre/db_data/"
DB_NAME="app.db"

#mkdir -p $DB_PATH
# cd $DB_PATH
touch $DB_NAME
chmod 777 $DB_PATH
chmod 777 $DB_PATH$DB_NAME

sqlite3 "$DB_NAME" <<EOF 
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT,
        secret_otp TEXT,
        reset_flag BOOLEAN,
        reset_time INTEGER
    );
    CREATE TABLE IF NOT EXISTS MESSAGES (
        id INTEGER PRIMARY KEY,
        sender TEXT NOT NULL, 
        recipient TEXT NOT NULL,
        message TEXT NOT NULL,
        isRead BOOLEAN DEFAULT FALSE,
        createdAt TEXT DEFAULT (datetime('now'))
    );
EOF

tail -f /dev/null;