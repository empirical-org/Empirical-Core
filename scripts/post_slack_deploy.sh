# This will post deploy text to the #quill-developer channel
# Usage
# sh post_slack_deploy.sh $app_name $environment $branch $finished_boolean
# e.g.
# sh post_slack_deploy.sh 'QuillLessons' 'staging' 'feat/new' true

personal_apps=("dan" "brendan" "pkong" "eric" "thomas" "cissy" "emilia")

username=$(git config user.name)
if $4; then status='FINISHED'; else status='STARTED'; fi

message=":ship: *$1 $2 Deploy* \`$status\`. branch: *_$3_*, deployed by: $username"

if printf '%s\n' "${personal_apps[@]}" | grep "^$2$"; then
  webhook=$(heroku config:get SLACK_API_WEBHOOK_PERSONAL --app empirical-grammar)
else 
  webhook=$(heroku config:get SLACK_API_WEBHOOK --app empirical-grammar)
fi

curl -X POST -H 'Content-type: application/json' --data "{'text':'$message'}" $webhook
