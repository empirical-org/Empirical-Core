#!/usr/bin/env bash

cd client
MOCKDIR=__mockdata__

if [ ! -d "$MOCKDIR" ]; then
 echo 'ERROR: __mockdata__ does not exist.  Maybe you forgot to run bundle exec
 rspec' 
else
  npm run jest
fi



