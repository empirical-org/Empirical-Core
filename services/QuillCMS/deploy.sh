#!/bin/bash
current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="QuillCMS"

case $1 in
  prod)
    EB_ENVIRONMENT_NAME=Quillcms-production
    EB_ENVIRONMENT_ID=e-ddeyrmmznn

    ;;
  staging)
    EB_ENVIRONMENT_NAME=Quillcms-staging
    EB_ENVIRONMENT_ID=e-43bp3rmj2g
    ;;
  *)
    echo "You must provide an environment argument of 'staging' or 'prod'."
    exit 1
esac

# Slack deploy start
sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch false

eb deploy ${EB_ENVIRONMENT_NAME} --label `git rev-parse HEAD`
open "https://rpm.newrelic.com/accounts/2639113/applications/548895592"
open "https://console.aws.amazon.com/elasticbeanstalk/home?region=us-east-1#/environment/dashboard?applicationName=${app_name}&environmentId=${EB_ENVIRONMENT_ID}"
