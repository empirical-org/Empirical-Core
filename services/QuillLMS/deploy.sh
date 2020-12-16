#!/bin/bash

current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="QuillLMS"

case $1 in
  prod)
    DEPLOY_GIT_BRANCH=deploy-lms-prod
    HEROKU_APP=empirical-grammar
    URL="https://www.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/548856875"
    current_branch="origin/production"
    ;;
  staging)
    DEPLOY_GIT_BRANCH=deploy-lms-staging
    HEROKU_APP=empirical-grammar-staging
    URL="https://staging.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/551848140"
    ;;
  staging2)
    DEPLOY_GIT_BRANCH=deploy-lms-staging2
    HEROKU_APP=empirical-grammar-staging2
    URL="https://staging2.quill.org/"
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
    if [ $1 == 'prod' ]
    then
        # For production, push directly from the remote production branch without going local
        git push --no-verify --force origin origin/production:refs/heads/$DEPLOY_GIT_BRANCH
        sh ../../scripts/post_slack_deploy_description.sh $app_name
    else
        git push --no-verify --force origin ${current_branch}:$DEPLOY_GIT_BRANCH
    fi
    open "https://dashboard.heroku.com/apps/$HEROKU_APP/activity"
    open $URL
    open $NR_URL
    echo "Deploy screen opened in your browser, you can monitor from there."
else
    echo "Ok, we won't deploy. Have a good day!"
fi
