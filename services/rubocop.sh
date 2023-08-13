#!/bin/bash
RUBY_VERSION='3.0.6'
RUBOCOP_VERSION='1.56.0'
RUBOCOP_RSPEC_VERSION='2.23.2'
RUBOCOP_RAILS_VERSION='2.20.2'

if command -v asdf &> /dev/null; then
    asdf local ruby $RUBY_VERSION
elif command -v rbenv &> /dev/null; then
    rbenv local $RUBY_VERSION
fi

gem install unicode-display_width
gem install rubocop -v 1.56.0
gem install rubocop-rspec -v 2.23.2
gem install rubocop-rails -v 2.20.2
#gem install rubocop-ast -v 1.29
#gem install ruby-progressbar
rubocop
