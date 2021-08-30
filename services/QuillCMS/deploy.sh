#!/bin/bash
current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="QuillCMS"

case $1 in
  prod)
    EB_ENVIRONMENT_NAME=Quillcms-production
    EB_ENVIRONMENT_ID=e-ddeyrmmznn
    if [[ "$current_branch" != "production" ]]
    then
      echo "******** CMS NON-PRODUCTION BRANCH DEPLOY ERROR ********"
      echo "AWS Elastic Beanstalk uses your local 'production' branch"
      echo "You must be on *local* branch 'production' to deploy CMS production"
      exit 1
    fi
    ;;
  staging)
    EB_ENVIRONMENT_NAME=Quillcms-staging
    EB_ENVIRONMENT_ID=e-43bp3rmj2g
    ;;
  *)
    echo "You must provide an environment argument of 'staging' or 'prod'."
    exit 1
esac

echo "******* CMS DEPLOY - AWS ELASTIC BEANSTALK *******"
read -r -p "Deploy *local* branch '$current_branch' to CMS '$1' environment on AWS Elastic Beanstalk? [y/N]" response
if [[ "$response" =~ ^([y])$ ]]
then
  if [ $1 == 'prod' ]
  then
    git checkout production
    git pull origin production
  fi

  if [[ -z $(git status --untracked-files=no -s) ]]
  then
    # Slack deploy start
    sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch false

    eb deploy ${EB_ENVIRONMENT_NAME} --label `git rev-parse HEAD`-$(date '+%s')
    open "https://rpm.newrelic.com/accounts/2639113/applications/548895592"
    eb console ${EB_ENVIRONMENT_NAME}
  else
    echo "Your working tree is dirty, please stash or commit changes before deploying."
    exit 1
  fi
else
    echo "Ok, we won't deploy. Have a good day!"
fi
