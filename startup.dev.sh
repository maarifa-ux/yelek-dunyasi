#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh dev-sensey-postgresql.postgres.database.azure.com:5432
npm run migration:run
npm run seed:run
npm run start:dev
