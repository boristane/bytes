#!/bin/bash
docker exec -ti bytes npm run test-unit
docker exec -ti bytes npm run test-users
docker exec -ti bytes npm run test-bytes
