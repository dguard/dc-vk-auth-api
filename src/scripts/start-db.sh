#!/bin/bash
set -e

SERVER="my_database_server";
PW="mysecretpassword";
DB="my_database";

echo "echo create and chown [/var/run/docker.sock]";
sudo touch /var/run/docker.sock
sudo chown -R ${USER}:${USER} /var/run/docker.sock

echo "echo stop & remove old docker [$SERVER]";
echo "echo starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name $SERVER -e POSTGRES_PASSWORD=$PW \
  -e PGPASSWORD=$PW \
  -p 5432:5432 \
  -d postgres

# wait for pg to start
echo "sleep wait for pg-server [$SERVER] to start";
/usr/bin/sleep 3;

# create the db
echo "CREATE DATABASE $DB ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
echo "\l" | docker exec -i $SERVER psql -U postgres

echo "========================================"
echo "please run:"
echo ">>> npm run typeorm:migration:run"
echo ">>> npm run start:dev:db:seed"
echo ">>> npm run start:dev";
