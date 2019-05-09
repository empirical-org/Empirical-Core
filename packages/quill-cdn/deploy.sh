#!/usr/bin/env bash

# Set environment-specific values
case $1 in
  prod)
    # ENSURE THAT WE'RE ON MASTER FOR PRODUCTION DEPLOYS
    current_branch=`git rev-parse --abbrev-ref HEAD`
    if [ "$current_branch" != "master" ]
    then
      echo "You can not make a production deploy from a branch other than 'master'.  Don't forget to make sure you have the latest code pulled."
      exit 1
    fi
    S3_DEPLOY_BUCKET=s3://quill-cdn
    ;;
  *)
    echo "You must provide an environment argument of 'prod'."
    exit 1
esac

# Upload build to S3 bucket
aws s3 sync ./assets ${S3_DEPLOY_BUCKET}
