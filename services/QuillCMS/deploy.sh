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
