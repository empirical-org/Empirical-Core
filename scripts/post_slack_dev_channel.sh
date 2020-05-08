# This will post text to the #quill-developer channel
# Pass text in as a var from the command line, e.g.
# sh post_slack_dev_channel.sh 'Deploy to QuillConnect Production'
curl -X POST -H 'Content-type: application/json' --data "{'text':'$1'}" $(heroku config:get SLACK_API_WEBHOOK --app empirical-grammar)

