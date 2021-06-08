#!/bin/bash

current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="ComprehensionGoEndpoint"

case $1 in
  prod)
    DEPLOY_GIT_BRANCH=deploy-comprehension-go-prod
    HEROKU_APP=comprehension-go-endpoint
    NR_URL="https://one.newrelic.com/launcher/nr1-core.explorer?platform[filters]=Iihkb21haW4gPSAnQVBNJyBBTkQgdHlwZSA9ICdBUFBMSUNBVElPTicpIg==&platform[timeRange][duration]=1800000&platform[$isFallbackTimeRange]=true&pane=eyJuZXJkbGV0SWQiOiJhcG0tbmVyZGxldHMub3ZlcnZpZXciLCJlbnRpdHlHdWlkIjoiTWpZek9URXhNM3hCVUUxOFFWQlFURWxEUVZSSlQwNThNVEUxTVRrM09UZzJOZyIsImlzT3ZlcnZpZXciOnRydWUsInJlZmVycmVycyI6eyJsYXVuY2hlcklkIjoibnIxLWNvcmUuZXhwbG9yZXIiLCJuZXJkbGV0SWQiOiJucjEtY29yZS5saXN0aW5nIn19&sidebars[0]=eyJuZXJkbGV0SWQiOiJucjEtY29yZS5hY3Rpb25zIiwic2VsZWN0ZWROZXJkbGV0Ijp7Im5lcmRsZXRJZCI6ImFwbS1uZXJkbGV0cy5vdmVydmlldyIsImlzT3ZlcnZpZXciOnRydWV9LCJlbnRpdHlHdWlkIjoiTWpZek9URXhNM3hCVUUxOFFWQlFURWxEUVZSSlQwNThNVEUxTVRrM09UZzJOZyJ9"
    current_branch="origin/production"
    ;;
  staging)
    DEPLOY_GIT_BRANCH=deploy-comprehension-go-staging
    HEROKU_APP=comprehension-go-staging
    NR_URL="https://one.newrelic.com/launcher/nr1-core.explorer?platform[timeRange][duration]=1800000&platform[$isFallbackTimeRange]=true&platform[filters]=Iihkb21haW4gPSAnQVBNJyBBTkQgdHlwZSA9ICdBUFBMSUNBVElPTicpIg==&pane=eyJuZXJkbGV0SWQiOiJhcG0tbmVyZGxldHMub3ZlcnZpZXciLCJlbnRpdHlHdWlkIjoiTWpZek9URXhNM3hCVUUxOFFWQlFURWxEUVZSSlQwNThNVEUxTXprMU1EWTFPUSIsImlzT3ZlcnZpZXciOnRydWUsInJlZmVycmVycyI6eyJsYXVuY2hlcklkIjoibnIxLWNvcmUuZXhwbG9yZXIiLCJuZXJkbGV0SWQiOiJucjEtY29yZS5saXN0aW5nIn19"
    ;;
  *)
    echo "You must provide an environment argument of 'prod'."
    exit 1
esac

read -r -p "Deploy branch '$current_branch' to '$1' environment? [y/N]" response
if [[ "$response" =~ ^([y])$ ]]
then
    sh ../../../scripts/post_slack_deploy.sh $app_name $1 $current_branch false
    if [ $1 == 'prod' ]
    then
        # For production, push directly from the remote production branch without going local
        # This 'remote merge' requires your local git history/pointers of the remote branches to be up-to-date, so we run a 'git fetch' to do that.
        # Documented here: https://github.com/empirical-org/test_repo/blob/destination_branch/test_file.txt
        git fetch origin production
        git fetch origin $DEPLOY_GIT_BRANCH
        git push --no-verify --force origin origin/production:refs/heads/$DEPLOY_GIT_BRANCH

        sh ../../../scripts/post_slack_deploy_description.sh $app_name
    else
        git fetch origin $DEPLOY_GIT_BRANCH
        git push --no-verify --force origin ${current_branch}:$DEPLOY_GIT_BRANCH
    fi
    open "https://dashboard.heroku.com/apps/$HEROKU_APP/activity"
    open $NR_URL
    echo "Deploy screen opened in your browser, you can monitor from there."
else
    echo "Ok, we won't deploy. Have a good day!"
fi
