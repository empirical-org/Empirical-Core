#!/usr/bin/env bash

# Set global values
QUILL_CMS=https://cms.quill.org

# Set environment-specific values
case $1 in
  prod)
    # ENSURE THAT WE'RE ON MASTER FOR PRODUCTION DEPLOYS
    git checkout master
    git pull origin master
    EMPIRICAL_BASE_URL=https://www.quill.org
    LESSONS_WEBSOCKETS_URL=https://lessons-server.quill.org/
    NODE_ENV=prod
    S3_DEPLOY_BUCKET=s3://aws-website-quill-lessons
    ;;
  staging)
    EMPIRICAL_BASE_URL=https://staging.quill.org
    LESSONS_WEBSOCKETS_URL=https://staging-lessons-server.quill.org/
    NODE_ENV=staging
    S3_DEPLOY_BUCKET=s3://aws-website-quill-lessons-staging
    ;;
  *)
    echo "You must provide an environment argument of either 'staging' or 'prod'."
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
