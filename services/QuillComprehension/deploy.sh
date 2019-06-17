#!/bin/bash

case $1 in
  prod)
    DEPLOY_GIT_REMOTE=quill-comprehension
    ;;
  *)
    echo "You must provide an environment argument of 'prod'."
    exit 1
esac

(cd ../.. && git push -f ${DEPLOY_GIT_REMOTE} `git subtree split --prefix services/QuillComprehension`:refs/heads/master)
