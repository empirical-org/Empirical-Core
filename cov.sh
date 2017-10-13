#!/usr/bin/env bash
rm -rf coverage
rm -rf lib-cov

mkdir coverage

jscover src lib-cov
mv src lib-orig
mv lib-cov src
NODE_ENV=test YOURPACKAGE_COVERAGE=1 mocha --opts mocha.opts --reporter mocha-lcov-reporter > coverage/coverage.lcov
rm -rf src
mv lib-orig srv
