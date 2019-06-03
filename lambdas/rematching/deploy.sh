#!/bin/bash

zip -rq deploy_code.zip .
aws lambda update-function-code --function-name rematch_lambda \
                                --zip-file fileb://deploy_code.zip \
                                --publish \
                                --profile peter-aws
rm deploy_code.zip
