#!/bin/bash

CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`

case $1 in
  prod)
    DEPLOY_GIT_REMOTE=quill-lms-prod
    if [ ${CURRENT_BRANCH} != "master" ]
    then
      echo "You can not make a production deploy from a branch other than 'master'.  Don't forget to make sure you have the latest code pulled."
      exit 1
    fi
    ;;
  staging)
    DEPLOY_GIT_REMOTE=quill-lms-staging
    ;;
  sprint)
    DEPLOY_GIT_REMOTE=quill-lms-sprint
    ;;
  *)
    echo "You must provide an environment argument of 'sprint', 'staging', or 'prod'."
    exit 1
esac

read -r -p "Deploy branch '$CURRENT_BRANCH' to '$1' environment? [Y/n]" response
if [[ "$response" =~ ^([Y])$ ]]
then
    git push ${DEPLOY_GIT_REMOTE} ${CURRENT_BRANCH}:master -v
    open "https://rpm.newrelic.com/accounts/2639113/applications/548856875"
else
    echo "Ok, we won't deploy. Have a good day!"
fi
