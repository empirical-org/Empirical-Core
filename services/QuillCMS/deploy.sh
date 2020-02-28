#!/bin/bash

case $1 in
  prod)
    EB_ENVIRONMENT_NAME=production
    ;;
  staging)
    EB_ENVIRONMENT_NAME=Quillcms-staging
    ;;
  *)
    echo "You must provide an environment argument of 'staging' or 'prod'."
    exit 1
esac

eb deploy ${EB_ENVIRONMENT_NAME}
# Add slack message
case $1 in
  prod)
    export SLACK_API_TOKEN=$(heroku config:get SLACK_API_TOKEN --app empirical-grammar)
    export PROJECT_NAME="QuillCMS"
    python3 ../post_slack_message.py
    ;;
esac

open "https://rpm.newrelic.com/accounts/770600/applications/74496669"
