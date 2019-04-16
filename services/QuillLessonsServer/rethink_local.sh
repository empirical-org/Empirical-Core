#!/usr/bin/env bash

# Set environment-specific values
case $1 in
  start)
    rethinkdb -d ./rethinkdb_data/ --pid-file ~/rethinkdb.pid --daemon
    ;;
  stop)
    kill $(cat ~/rethinkdb.pid)
    ;;
  *)
    echo "You must provide an action parameter of either 'start' or 'stop'."
    exit 1
esac
