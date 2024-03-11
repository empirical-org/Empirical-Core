#!/bin/bash

current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="QuillLMS"

osx_notification=0

for arg in "$@"; do
  case $arg in
    --osx-notification)
      osx_notification=1
      ;;
  esac
done

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
    ;;
  dan)
    DEPLOY_GIT_BRANCH=deploy-lms-dan
    HEROKU_APP=quill-lms-dan
    URL="https://dan.quill.org/"
    ;;
  brendan)
    DEPLOY_GIT_BRANCH=deploy-lms-brendan
    HEROKU_APP=quill-lms-brendan
    URL="https://brendan.quill.org/"
    ;;
  eric)
    DEPLOY_GIT_BRANCH=deploy-lms-eric
    HEROKU_APP=quill-lms-eric
    URL="https://eric.quill.org/"
    ;;
  pkong)
    DEPLOY_GIT_BRANCH=deploy-lms-pkong
    HEROKU_APP=quill-lms-pkong
    URL="https://pkong.quill.org/"
    ;;
  thomas)
    DEPLOY_GIT_BRANCH=deploy-lms-thomas
    HEROKU_APP=quill-lms-thomas
    URL="https://thomas.quill.org/"
    ;;
  cissy)
    DEPLOY_GIT_BRANCH=deploy-lms-cissy
    HEROKU_APP=quill-lms-cissy
    URL="https://cissy.quill.org/"
    ;;
  emilia)
    DEPLOY_GIT_BRANCH=deploy-lms-emilia
    HEROKU_APP=quill-lms-emilia
    URL="https://emilia.quill.org/"
    ;;
  *)
    echo "You must provide an environment argument of 'staging', 'prod', or a developer name."
    exit 1
esac

read -r -p "Deploy branch '$current_branch' to '$1' environment? [y/N]" response
if [[ "$response" =~ ^([y])$ ]]
then
    sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch false
    if [ $1 == 'prod' ]
    then
        CURRENT_DATE=`date +%l:%M%p`
        read -r -p "Does this deploy include a migration that need to run?  Quill policy is to not run migrations between the hours of 10am and 3pm Eastern time on school days unless it is an emergency.  Your local time is $CURRENT_DATE.  You may cancel your deploy with ctrl-c.  If you want to continue this deploy, press any key."  response
        # For production, push directly from the remote production branch without going local
        # This 'remote merge' requires your local git history/pointers of the remote branches to be up-to-date, so we run a 'git fetch' to do that.
        # Documented here: https://github.com/empirical-org/test_repo/blob/destination_branch/test_file.txt
        git fetch origin production
        git fetch origin $DEPLOY_GIT_BRANCH
        git push --no-verify --force origin origin/production:refs/heads/$DEPLOY_GIT_BRANCH

        sh ../../scripts/post_slack_deploy_description.sh $app_name

        open $NR_URL
    else
        git fetch origin $DEPLOY_GIT_BRANCH
        git push --no-verify --force origin ${current_branch}:$DEPLOY_GIT_BRANCH
    fi
    open "https://dashboard.heroku.com/apps/$HEROKU_APP/activity"
    open $URL
    echo "Deploy screen opened in your browser, you can monitor from there."

    if [ "$osx_notification" -eq 1 ]; then
      ./script/osx_notification_on_build_completion.sh $HEROKU_APP
    fi
else
    echo "Ok, we won't deploy. Have a good day!"
fi
