#!/bin/bash

if [[ $# -ne 1 ]] ; then
  echo 'You must provide a single argument to seed the test with.'
  exit 0
fi

bundle exec rake spec SPEC_OPTS="--seed $1"
