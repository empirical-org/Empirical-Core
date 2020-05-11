# This will post deploy text to the #quill-developer channel
# Usage
# sh post_slack_deploy.sh $app_name $environment $branch $finished_boolean
# e.g.
# sh post_slack_deploy.sh 'QuillLessons' 'staging' 'feat/new' true

username=$(git config user.name)
if $4; then status='FINISHED'; else status='STARTED'; fi

message="*$1 Deploy* \`$status\`-\`$2\` environment. *_$3_* branch by $username"
webhook=$(heroku config:get SLACK_API_WEBHOOK --app empirical-grammar)

curl -X POST -H 'Content-type: application/json' --data "{'text':'$message'}" $webhook
