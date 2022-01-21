#!/bin/bash
rbenv local 2.5.1
gem install rubocop -v 0.93.1
rubocop
