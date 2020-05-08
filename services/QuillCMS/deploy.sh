#!/bin/bash
current_branch=`git rev-parse --abbrev-ref HEAD`
username=$(git config user.name)
app_name="QuillCMS"

start_message="*$app_name Deploy* \`STARTED\`: $username started a deploy of \`$current_branch\` to the \`$1\` environment"
sh ../../scripts/post_slack_dev_channel.sh "$start_message"


case $1 in
  prod)
    EB_ENVIRONMENT_NAME=production
    ;;
  staging)
    EB_ENVIRONMENT_NAME=Quillcms-staging
    ;;
  *)
    echo "You must provide an environment argument of 'staging' or 'prod'."
    exit 1
esac

eb deploy ${EB_ENVIRONMENT_NAME}
# Add slack message
message="*$app_name Deploy* \`FINISHED\`: $username started a deploy of \`$current_branch\` to the \`$1\` environment"
sh ../../scripts/post_slack_dev_channel.sh "$message"
