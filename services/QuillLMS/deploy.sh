#!/bin/bash

current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="QuillLMS"

case $1 in
  prod)
    DEPLOY_GIT_BRANCH=deploy-lms-prod
    HEROKU_APP=empirical-grammar
    URL="https://www.quill.org/"
    AUTOSCALE_URL="https://app.railsautoscale.com/empirical-grammar/settings/edit"
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

    heroku git:remote -a $HEROKU_APP

    if [ $1 == 'prod' ]
    then
        # For production, push directly from the remote production branch without going local
        # This 'remote merge' requires your local git history/pointers of the remote branches to be up-to-date, so we run a 'git fetch' to do that.
        # Documented here: https://github.com/empirical-org/test_repo/blob/destination_branch/test_file.txt
        git fetch origin production
        # Heroku's git server keeps `push` calls open during the full deploy process
        # This means that under normal circumstances, this `push` call wouldn't terminate for, like, 20 minutes and the scriptwouldn't terminate
        # In order to avoid that, we apply `nohup` to disconnect stdin, pipe outputs to /dev/null, and end the command with `&` to run the command in the background
        nohup git push --no-verify --force heroku origin/production:refs/heads/main &> /dev/null &

        sh ../../scripts/post_slack_deploy_description.sh $app_name
        open $AUTOSCALE_URL
    else
        # See note in the $1=="prod" condition for an explanation of this command's construction
        nohup git push --no-verify --force heroku ${current_branch}:main &> /dev/null
    fi
    open "https://dashboard.heroku.com/apps/$HEROKU_APP/activity"
    open $URL
    open $NR_URL
    echo "Deploy screen opened in your browser, you can monitor from there."
else
    echo "Ok, we won't deploy. Have a good day!"
fi
