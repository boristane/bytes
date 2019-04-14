#!/bin/bash
PGPASSWORD=password psql -h "localhost" -U "postgres" -c '\q'
PGPASSWORD=password createdb -h localhost -p 5432 -U postgres bytes
npx ts-node ./node_modules/typeorm/cli.js schema:sync
