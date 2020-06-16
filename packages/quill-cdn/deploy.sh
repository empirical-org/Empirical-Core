#!/usr/bin/env bash

# Set environment-specific values
case $1 in
  prod)
    current_branch=`git rev-parse --abbrev-ref HEAD`
    S3_DEPLOY_BUCKET=s3://quill-cdn
    ;;
  *)
    echo "You must provide an environment argument of 'prod'."
    exit 1
esac

# Upload build to S3 bucket
aws s3 sync ./assets ${S3_DEPLOY_BUCKET}
