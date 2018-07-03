
# Quill Jenkins


## Webhooks.

GitHub communicates with Jenkins through a webhook.  When a PR is submitted,
GitHUb should use the webhook to alert Jenkins of that fact.  This will trigger
a test, build, and potentially deploy to master or staging.

Some of the set-up can be seen
[here](https://learning-continuous-deployment.github.io/jenkins/github/2015/04/17/github-jenkins/).


