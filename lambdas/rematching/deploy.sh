#!/bin/bash

# Step 1: Build the project with Vite
npx vite build

# Determine the environment based on input
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

# Step 2: Change directory to the build output directory
cd dist

# Step 3: Zip the build output
zip -rq deploy_code.zip .

# Step 4: Upload the zipped package to AWS Lambda
aws lambda update-function-code --function-name ${TARGET_LAMBDA} \
                                --zip-file fileb://deploy_code.zip \
                                --publish \
                                --profile peter-aws \
                                --region us-east-1

# Step 5: Cleanup - remove the zipped package
rm deploy_code.zip

echo "Deployment completed successfully."
