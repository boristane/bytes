#!/bin/bash
docker-compose up -d
docker exec -ti postgres createdb -h localhost -p 5432 -U postgres bytes
docker exec -ti bytes npx ts-node ./test/utils/setup-db.ts
docker exec -ti bytes npm run dev