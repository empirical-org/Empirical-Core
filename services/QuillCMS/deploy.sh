#!/bin/bash
current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="QuillCMS"

case $1 in
  prod)
    DEPLOY_GIT_BRANCH=deploy-cms-prod
    HEROKU_APP=quill-cms
    AUTOSCALE_URL="https://app.railsautoscale.com/quill-cms/settings/edit"
    NR_URL="https://one.newrelic.com/launcher/nr1-core.explorer/?platform[$isFallbackTimeRange]=true&platform[timeRange][duration]=1800000&pane=eyJuZXJkbGV0SWQiOiJhcG0tbmVyZGxldHMub3ZlcnZpZXciLCJlbnRpdHlHdWlkIjoiTWpZek9URXhNM3hCVUUxOFFWQlFURWxEUVZSSlQwNThOVFE0T0RrMU5Ua3kiLCJpc092ZXJ2aWV3Ijp0cnVlLCJyZWZlcnJlcnMiOnsibGF1bmNoZXJJZCI6Im5yMS1jb3JlLmV4cGxvcmVyIiwibmVyZGxldElkIjoibnIxLWNvcmUubGlzdGluZyJ9fQ==&sidebars[0]=eyJuZXJkbGV0SWQiOiJucjEtY29yZS5hY3Rpb25zIiwic2VsZWN0ZWROZXJkbGV0Ijp7Im5lcmRsZXRJZCI6ImFwbS1uZXJkbGV0cy5vdmVydmlldyIsImlzT3ZlcnZpZXciOnRydWV9LCJlbnRpdHlHdWlkIjoiTWpZek9URXhNM3hCVUUxOFFWQlFURWxEUVZSSlQwNThOVFE0T0RrMU5Ua3kifQ==&state=45fc2d88-c9af-3953-4215-b74ce7fb2749"
    current_branch="origin/production"
    ;;
  staging)
    DEPLOY_GIT_BRANCH=deploy-cms-staging
    HEROKU_APP=quill-cms-staging
    ;;
esac

read -r -p "Deploy branch '$current_branch' to '$1' environment? [y/N]" response
if [[ "$response" =~ ^([y])$ ]]
then
    sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch false

    heroku git:remote -a $HEROKU_APP

    open "https://dashboard.heroku.com/apps/$HEROKU_APP/activity"

    if [ $1 == 'prod' ]
    then
        open $AUTOSCALE_URL
        open $NR_URL

        # For production, push directly from the remote production branch without going local
        # This 'remote merge' requires your local git history/pointers of the remote branches to be up-to-date, so we run a 'git fetch' to do that.
        # Documented here: https://github.com/empirical-org/test_repo/blob/destination_branch/test_file.txt
        git fetch origin production
        git push --no-verify --force heroku origin/production:refs/heads/main
    else
        # See note in the $1=="prod" condition for an explanation of this command's construction
        git push --no-verify --force heroku ${current_branch}:main
    fi
    echo "Deploy screen opened in your browser, you can monitor from there."
else
    echo "Ok, we won't deploy. Have a good day!"
fi
