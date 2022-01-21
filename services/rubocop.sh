#!/bin/bash
rbenv local 2.5.1
gem install rubocop -v 1.25.0
rubocop
