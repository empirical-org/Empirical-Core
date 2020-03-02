#!/bin/bash
case $1 in
  prod)
    DEPLOY_GIT_REMOTE=https://git.heroku.com/lessons-server.git
    ;;
  staging)
    DEPLOY_GIT_REMOTE=https://git.heroku.com/lessons-server-staging.git
    ;;
  *)
    echo "You must provide an environment argument of 'staging' or 'prod'."
    exit 1
esac
STARTING_BRANCH=`git rev-parse --abbrev-ref HEAD`
TEMP_DEPLOY_BRANCH=temp-for-deploy
(git checkout -b ${TEMP_DEPLOY_BRANCH} &&
 cd ../.. &&
 git filter-branch --subdirectory-filter services/QuillLMS --force HEAD^..HEAD &&
 git push -f ${DEPLOY_GIT_REMOTE} ${TEMP_DEPLOY_BRANCH}:master)
git checkout ${STARTING_BRANCH}
git branch -D ${TEMP_DEPLOY_BRANCH}
open "https://rpm.newrelic.com/accounts/770600/applications/195705504"