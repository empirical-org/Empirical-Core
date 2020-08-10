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
    DASHBOARD="https://dashboard.heroku.com/apps/lessons-server/activity"
    ;;
  staging)
    DEPLOY_GIT_BRANCH=deploy-lessons-server-staging
    DASHBOARD="https://dashboard.heroku.com/apps/lessons-server-staging/activity"
    ;;
  *)
    echo "You must provide an environment argument of 'staging', or 'prod'."
    exit 1
esac

read -r -p "Deploy branch '$current_branch' to '$1' environment? [y/N]" response
if [[ "$response" =~ ^([y])$ ]]
then
    # Slack deploy start
    sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch false
    git push origin -f ${current_branch}:${DEPLOY_GIT_BRANCH}
    open $DASHBOARD
    echo "Deploy screen opened in your browser, you can monitor from there."
else
    echo "Ok, we won't deploy. Have a good day!"
fi
