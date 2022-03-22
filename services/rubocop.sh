#!/bin/bash
rbenv local 2.6.6
gem install rubocop -v 1.25.0
gem install rubocop-rspec -v 2.8.0
rubocop
