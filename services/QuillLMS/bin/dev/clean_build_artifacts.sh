#!/bin/bash

DIRECTORIES_TO_CLEAN=( "log" "tmp" "public/webpack" )

for TARGET in "${DIRECTORIES_TO_CLEAN[@]}"
do
  if [ -d "$TARGET" ]
    then
      rm -rf "$TARGET"
  fi
done

# Recreate the log directory since we have a .gitkeep meaning
# that we are intentionally keeping it around
mkdir log
touch log/.gitkeep
