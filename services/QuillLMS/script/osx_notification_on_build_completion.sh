#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <heroku_app_name>"
  exit 1
fi

# Set your Heroku app name
APP_NAME="$1"

echo "Build is in progress..."

# wait for the build to start;
# otherwise FOURTH LINE return "succeeded" from a previous build
sleep 30

# Fetch the latest build status
FOURTH_LINE=$(heroku builds -a $APP_NAME | sed -n 4p)
STATUS=""

if echo "$FOURTH_LINE" | grep -q "pending"; then
  STATUS="pending"
elif echo "$FOURTH_LINE" | grep -q "succeeded"; then
  STATUS="succeeded"
elif echo "$FOURTH_LINE" | grep -q "failed"; then
  STATUS="failed"
else
  STATUS="unknown"
fi

while [ "$STATUS" == "pending" ]; do
  sleep 5
  FOURTH_LINE=$(heroku builds -a $APP_NAME | sed -n 4p)

  if echo "$FOURTH_LINE" | grep -q "pending"; then
    STATUS="pending"
  elif echo "$FOURTH_LINE" | grep -q "succeeded"; then
    STATUS="succeeded"
  elif echo "$FOURTH_LINE" | grep -q "failed"; then
    STATUS="failed"
  else
    STATUS="unknown"
  fi
done

osascript -e "display notification \"build_status: $STATUS\" with title \"Heroku: $APP_NAME\""
