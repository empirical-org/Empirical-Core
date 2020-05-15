#!/bin/bash
current_branch=`git rev-parse --abbrev-ref HEAD`
app_name="QuillComprehension (turking)"

case $1 in
  prod)
    DEPLOY_GIT_REMOTE=quill-comprehension
    ;;
  *)
    echo "You must provide an environment argument of 'prod'."
    exit 1
esac

# Slack deploy start
sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch false

(cd ../.. && git push -f ${DEPLOY_GIT_REMOTE} `git subtree split --prefix services/QuillComprehension`:refs/heads/master)

# Slack deploy finish
sh ../../scripts/post_slack_deploy.sh $app_name $1 $current_branch true
