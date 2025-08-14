#! /bin/bash

DB_PATH="$HOME/goinfre/db_data/"
DB_NAME="app.db"

mkdir -p $DB_PATH
touch $DB_NAME

sqlite3 "$DB_NAME" <<EOF 
    CREATE TABLE IF NOT EXISTS PLAYERS (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL, 
        email TEXT NOT NULL,
        password TEXT NOT NULL
    );
EOF