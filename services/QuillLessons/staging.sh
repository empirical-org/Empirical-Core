#!/usr/bin/env bash

if [[ -d ./dist ]]
then
  rm -rf ./dist
fi

EMPIRICAL_BASE_URL=https://staging.quill.org \
FIREBASE_APP_NAME=quillconnect \
LESSONS_WEBSOCKETS_URL=https://lessons-server.quill.org \
NODE_ENV=production \
QUILL_CMS=https://cms.quill.org \
webpack -p

aws s3 sync ./dist/ s3://quill-lessons-staging --delete
