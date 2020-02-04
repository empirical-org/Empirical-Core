#!/bin/bash
rbenv local 2.5.1
gem install rubocop -v 0.78
rubocop
