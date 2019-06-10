#!/bin/bash

case $1 in
  prod)
    TARGET_LAMBDA=rematch_lambda
    ;;
  staging)
    TARGET_LAMBDA=rematch_lambda_stage
    ;;
  *)
    echo "You must provide an environment argument of 'staging' or 'prod'."
    exit 1
esac

zip -rq deploy_code.zip .
aws lambda update-function-code --function-name ${TARGET_LAMBDA} \
                                --zip-file fileb://deploy_code.zip \
                                --publish \
                                --profile peter-aws \
                                --region us-east-1
rm deploy_code.zip
