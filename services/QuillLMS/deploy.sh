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
  dan)
    DEPLOY_GIT_BRANCH=deploy-lms-dan
    HEROKU_APP=quill-lms-dan
    URL="https://dan.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/551848140"
    ;;
  brendan)
    DEPLOY_GIT_BRANCH=deploy-lms-brendan
    HEROKU_APP=quill-lms-brendan
    URL="https://brendan.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/551848140"
    ;;
  eric)
    DEPLOY_GIT_BRANCH=deploy-lms-eric
    HEROKU_APP=quill-lms-eric
    URL="https://eric.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/551848140"
    ;;
  pkong)
    DEPLOY_GIT_BRANCH=deploy-lms-pkong
    HEROKU_APP=quill-lms-pkong
    URL="https://pkong.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/551848140"
    ;;
  thomas)
    DEPLOY_GIT_BRANCH=deploy-lms-thomas
    HEROKU_APP=quill-lms-thomas
    URL="https://thomas.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/551848140"
    ;;
  cissy)
    DEPLOY_GIT_BRANCH=deploy-lms-cissy
    HEROKU_APP=quill-lms-cissy
    URL="https://cissy.quill.org/"
    NR_URL="https://rpm.newrelic.com/accounts/2639113/applications/551848140"
    ;;
  emilia)
    DEPLOY_GIT_BRANCH=deploy-lms-emilia
    HEROKU_APP=quill-lms-emilia
    URL="https://emilia.quill.org/"
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
        # This 'remote merge' requires your local git history/pointers of the remote branches to be up-to-date, so we run a 'git fetch' to do that.
        # Documented here: https://github.com/empirical-org/test_repo/blob/destination_branch/test_file.txt
        git fetch origin production
        git fetch origin $DEPLOY_GIT_BRANCH
        git push --no-verify --force origin origin/production:refs/heads/$DEPLOY_GIT_BRANCH

        sh ../../scripts/post_slack_deploy_description.sh $app_name
    else
        git fetch origin $DEPLOY_GIT_BRANCH
        git push --no-verify --force origin ${current_branch}:$DEPLOY_GIT_BRANCH
    fi
    open "https://dashboard.heroku.com/apps/$HEROKU_APP/activity"
    open $URL
    open $NR_URL
    echo "Deploy screen opened in your browser, you can monitor from there."
else
    echo "Ok, we won't deploy. Have a good day!"
fi
