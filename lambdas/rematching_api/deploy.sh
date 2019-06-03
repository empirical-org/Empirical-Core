#!/bin/bash

case $1 in
  prod)
    TARGET_LAMBDA=rematchApi
    ;;
  staging)
    TARGET_LAMBDA=rematchApi_stage
    ;;
  *)
    echo "You must provide an environment argument of 'staging' or 'prod'."
    exit 1
esac

zip -rq deploy_code.zip .
aws lambda update-function-code --function-name ${TARGET_LAMBDA} \
                                --zip-file fileb://deploy_code.zip \
                                --publish \
                                --profile peter-aws
rm deploy_code.zip
