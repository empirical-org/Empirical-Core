#!/usr/bin/env bash

if [[ -d ./dist ]]
then
  rm -rf ./dist
fi

EMPIRICAL_BASE_URL=https://www.quill.org \
LESSONS_WEBSOCKETS_URL=https://lessons-server.quill.org \
NODE_ENV=production \
QUILL_CMS=https://cms.quill.org \
webpack -p

aws s3 sync ./dist/ s3://quill-lessons --delete
./rollbar.sh
