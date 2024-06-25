#!/bin/bash

# Determine the environment based on input
case $1 in
  prod)
    TARGET_ENV=rematch_prod
    ;;
  staging)
    TARGET_ENV=rematch_staging
    ;;
  *)
    echo "You must provide an environment argument of 'staging' or 'prod'."
    exit 1
esac


cd ../rematching
ENTRY_POINT=index-cloudflare.js ./build_cloudflare.sh
cd -

wrangler deploy ../rematching/dist/index-cloudflare.js --name ${TARGET_ENV}
