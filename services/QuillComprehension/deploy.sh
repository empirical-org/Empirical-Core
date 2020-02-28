#!/bin/bash

case $1 in
  prod)
    DEPLOY_GIT_REMOTE=quill-comprehension
    ;;
  *)
    echo "You must provide an environment argument of 'prod'."
    exit 1
esac

(cd ../.. && git push -f ${DEPLOY_GIT_REMOTE} `git subtree split --prefix services/QuillComprehension`:refs/heads/master)

# Add slack message
case $1 in
  prod)
    export SLACK_API_TOKEN=$(heroku config:get SLACK_API_TOKEN --app empirical-grammar)
    export PROJECT_NAME="QuillComprehension"
    python3 ../post_slack_message.py
    ;;
esac