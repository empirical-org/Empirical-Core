#!/bin/bash

case $1 in
  prod)
    DEPLOY_GIT_REMOTE=quill-lms-prod
    ;;
  staging)
    DEPLOY_GIT_REMOTE=quill-lms-staging
    ;;
  sprint)
    DEPLOY_GIT_REMOTE=quill-lms-sprint
    ;;
  *)
    echo "You must provide an environment argument of 'sprint', 'staging', or 'prod'."
    exit 1
esac

(cd ../.. && git push -f ${DEPLOY_GIT_REMOTE} `git subtree split --prefix services/QuillLMS`:refs/heads/master)
