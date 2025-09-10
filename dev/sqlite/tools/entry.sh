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
        intra42_id INTEGER,
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
EOF

tail -f /dev/null;