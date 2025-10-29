#! /bin/bash


cp -r ./assets/* ./public/

exec npm run dev -- --host;