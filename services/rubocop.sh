#!/bin/bash
rbenv local 2.6.6
gem install rubocop -v 1.28.2
gem install rubocop-rails -v 2.14.2
gem install rubocop-rspec -v 2.10.0
rubocop
