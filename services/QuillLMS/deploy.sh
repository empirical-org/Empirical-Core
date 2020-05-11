#!/bin/bash

current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="QuillLMS"

case $1 in
  prod)
    DEPLOY_GIT_REMOTE=quill-lms-prod
    URL="https://www.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/548856875"
    if [ ${current_branch} != "master" ]
    then
      echo "You can not make a production deploy from a branch other than 'master'.  Don't forget to make sure you have the latest code pulled."
      exit 1
    fi
    ;;
  staging)
    DEPLOY_GIT_REMOTE=quill-lms-staging
    URL="https://staging.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/551848140"
    ;;
  sprint)
    DEPLOY_GIT_REMOTE=quill-lms-sprint
    URL="https://sprint.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/551848140"
    ;;
  *)
    echo "You must provide an environment argument of 'sprint', 'staging', or 'prod'."
    exit 1
esac

read -r -p "Deploy branch '$CURRENT_BRANCH' to '$1' environment? [y/N]" response
if [[ "$response" =~ ^([y])$ ]]
then
    # Slack deploy start
    sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch false
    git push -f ${DEPLOY_GIT_REMOTE} ${current_branch}:master -v
    open $URL
    open $NR_URL
    # Slack deploy finish
    sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch true
else
    echo "Ok, we won't deploy. Have a good day!"
fi
