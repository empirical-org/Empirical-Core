# This will post deploy text to the #product_updates channel
# Usage
# sh post_slack_deploy_description.sh $app_name
# e.g.
# sh post_slack_deploy_description.sh 'QuillLessons'
# It will prompt for a description

username=$(git config user.name)

YELLOW='\033[1;33m'
NC='\033[0m'
echo "*****************************"
echo "*****************************"
echo "*** $YELLOW Add a description $NC *****"
echo "** $YELLOW for #product_updates! $NC **"
echo "*****************************"
read -p 'Description for non-engineers: ' description

message=":ship: *$1* Release! Author: $username *Description*: $description"
webhook=$(heroku config:get SLACK_API_PRODUCT_UPDATES --app empirical-grammar)

# remove single quotes since it messes with the JSON format
escaped_message="${message//\'/}"

curl -X POST -H 'Content-type: application/json' --data "{'text': '$escaped_message'}" $webhook
