current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="QuillLessonsServer"

case $1 in
  prod)
    if [ ${current_branch} != "production" ]
    then
      echo "You can not make a production deploy from a branch other than 'production'.  Don't forget to make sure you have the latest code pulled."
      exit 1
    fi
    DEPLOY_GIT_BRANCH=deploy-lessons-server-prod
    HEROKU_APP=lessons-server
    DASHBOARD="https://dashboard.heroku.com/apps/lessons-server/activity"
    ;;
  staging)
    DEPLOY_GIT_BRANCH=deploy-lessons-server-staging
    HEROKU_APP=lessons-server-staging
    DASHBOARD="https://dashboard.heroku.com/apps/lessons-server-staging/activity"
    ;;
  *)
    echo "You must provide an environment argument of 'staging', or 'prod'."
    exit 1
esac

read -r -p "Deploy branch '$current_branch' to '$1' environment? [y/N]" response
if [[ "$response" =~ ^([y])$ ]]
then

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
    else
        # See note in the $1=="prod" condition for an explanation of this command's construction
        nohup git push --no-verify --force heroku ${current_branch}:main &> /dev/null &
    fi

    # Slack deploy start
    sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch false
    open $DASHBOARD
    echo "Deploy screen opened in your browser, you can monitor from there."
else
    echo "Ok, we won't deploy. Have a good day!"
fi
