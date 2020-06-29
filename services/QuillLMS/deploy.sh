#!/bin/bash

current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="QuillLMS"

case $1 in
  prod)
    DEPLOY_GIT_BRANCH=deploy-lms-prod
    HEROKU_APP=empirical-grammar
    URL="https://www.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/548856875"
    if [ ${current_branch} != "production" ]
    then
      echo "You can not make a production deploy from a branch other than 'production'.  Don't forget to make sure you have the latest code pulled."
      exit 1
    fi
    ;;
  staging)
    DEPLOY_GIT_BRANCH=deploy-lms-staging
    HEROKU_APP=empirical-grammar-staging
    URL="https://staging.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/551848140"
    ;;
  sprint)
    DEPLOY_GIT_BRANCH=deploy-lms-sprint
    HEROKU_APP=quill-lms-sprint
    URL="https://sprint.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/551848140"
    ;;
  *)
    echo "You must provide an environment argument of 'sprint', 'staging', or 'prod'."
    exit 1
esac

read -r -p "Deploy branch '$current_branch' to '$1' environment? [y/N]" response
if [[ "$response" =~ ^([y])$ ]]
then
    sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch false
    git push origin -f ${current_branch}:$DEPLOY_GIT_BRANCH
    open "https://dashboard.heroku.com/apps/$HEROKU_APP/activity"
    open $URL
    open $NR_URL
    echo "Deploy screen opened in your browser, you can monitor from there."
else
    echo "Ok, we won't deploy. Have a good day!"
fi
