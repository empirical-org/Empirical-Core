#!/usr/bin/env bash

# Set global values
QUILL_CMS=https://cms.quill.org
current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="QuillLessons"

# Set environment-specific values
case $1 in
  prod)
    # ENSURE THAT WE'RE ON production FOR PRODUCTION DEPLOYS
    if [ "$current_branch" != "production" ]
    then
      echo "You can not make a production deploy from a branch other than 'production'.  Don't forget to make sure you have the latest code pulled."
      exit 1
    fi
    export EMPIRICAL_BASE_URL=https://www.quill.org
    export LESSONS_WEBSOCKETS_URL=https://lessons-server.quill.org/
    export NODE_ENV=prod
    export QUILL_CDN_URL=https://assets.quill.org
    S3_DEPLOY_BUCKET=s3://aws-website-quill-lessons
    ;;
  staging)
    export EMPIRICAL_BASE_URL=https://staging.quill.org
    export LESSONS_WEBSOCKETS_URL=https://staging-lessons-server.quill.org/
    export NODE_ENV=staging
    export QUILL_CDN_URL=https://assets.quill.org
    S3_DEPLOY_BUCKET=s3://aws-website-quill-lessons-staging
    ;;
  *)
    echo "You must provide an environment argument of either 'staging' or 'prod'."
    exit 1
esac

# Remove any old builds we have lying around
if [[ -d ./dist ]]
then
  rm -rf ./dist
fi

# Execute a new build
npm run build

# Upload build to S3 bucket
aws s3 sync ./dist ${S3_DEPLOY_BUCKET} --profile peter-aws

# Slack deploy finish
sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch true
