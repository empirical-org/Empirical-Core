#!/bin/bash

echo "Installing script dependencies..."
brew install jq

echo "Installing RethinkDB for local use..."
brew update
brew install rethinkdb

echo "Setting up local RethinkDB in prep to load seed data..."
./rethink_local.sh start
echo -n "Please provide the path to your RethinkDB seed data dump: "
read rethink_dump_path
echo "Loading seed data into local RethinkDB instance..."
$(rethinkdb restore --force $rethink_dump_path)
./rethink_local.sh stop

echo "Generating and configuring JWT public/private keypair..."
ssh-keygen -t rsa -b 4096 -N '' -m PEM -f lessons_server_jwt_keypair
jq -n --arg cert "$(openssl rsa -in lessons_server_jwt_keypair -pubout)" '{env: {JWT_PUBLIC_KEY: $cert}}' > nodemon.json
echo -e '\n' >> ../QuillLMS/.env
echo "LESSONS_PRIVATE_KEY=$(cat lessons_server_jwt_keypair | jq -R -c -s)" >> ../QuillLMS/.env
rm lessons_server_jwt_keypair*

echo ""
echo ""
echo "You'll now need to update the 'form_url' and 'module_url' values for the 'Quill Lessons' ActivityClassification in your local QuillLMS instance.  You'll need to update both of their hosts to be 'http://localhost:8090/'."
