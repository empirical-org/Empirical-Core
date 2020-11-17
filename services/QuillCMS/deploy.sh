#!/bin/bash
current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="QuillCMS"

case $1 in
  prod)
    EB_ENVIRONMENT_NAME=production-ruby2-6
    ;;
  staging)
    EB_ENVIRONMENT_NAME=Quillcms-staging
    ;;
  *)
    echo "You must provide an environment argument of 'staging' or 'prod'."
    exit 1
esac

# Slack deploy start
sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch false

eb deploy ${EB_ENVIRONMENT_NAME}
open "https://rpm.newrelic.com/accounts/2639113/applications/548895592"
open "https://console.aws.amazon.com/elasticbeanstalk/home?region=us-east-1#/environment/dashboard?applicationName=QuillCMS&environmentId=e-7n7bmkzhp3"
