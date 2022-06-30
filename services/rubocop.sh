#!/bin/bash
rbenv local 2.7.6
gem install rubocop -v 1.28.2
gem install rubocop-rspec -v 2.10
gem install activesupport -v 6.1.5.1
gem install rubocop-rails -v 2.14.2
rubocop
