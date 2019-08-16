echo 'Install Homebrew'
if which brew > /dev/null; then
  echo 'Already installed'
else
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

echo 'Update Homebrew'
brew update
brew upgrade
brew doctor

echo 'Install requirements'
brew install postgresql@10
brew install yarn
brew install rbenv
brew tap homebrew/services

echo 'Install rbenv'
if which rbenv > /dev/null; then
  echo 'Already installed'
else
  echo "Error installing Rbenv" 1>&2
  exit 1
fi

RUBY_VERSION=$(rbenv local)

# script to verify that rbenv is installed properly: From the readme: https://github.com/rbenv/rbenv
curl -fsSL https://github.com/rbenv/rbenv-installer/raw/master/bin/rbenv-doctor | bash

eval "$(rbenv init -)"
rbenv rehash

# reset terminal
touch ~/.bashrc
source ~/.bashrc

echo 'Install Bundler'
# there are breaking changes in bundler 2.0, so pin to this version for now.
gem install bundler -v 1.17.3

echo 'Bundle install'
echo 'If youre on Mac Mojave and hit an error with nokogiri, run:'
echo 'cd  /Library/Developer/CommandLineTools/Packages/;'
echo 'open macOS_SDK_headers_for_macOS_10.14.pkg'
bundle install
yarn

echo 'Copy config files'
# Note, -n is for 'no clobber', it won't overwrite if the file exists
cp -n config/database.yml.example config/database.yml

echo 'start postgres'
brew services restart postgresql@10

echo 'export PATH="/usr/local/opt/postgresql@10/bin:$PATH"' >> ~/.bash_profile
export PKG_CONFIG_PATH="/usr/local/opt/postgresql@10/lib/pkgconfig"

echo 'create the app DB user quill_dev and quill_test'
# Ideally, this would be more restrictive (shouldn't need a superuser), but would need some DB edits
createuser quill_dev --superuser
createuser quill_test --superuser

echo 'set up app DB, migrate database'
bundle exec rake db:setup
bundle exec rake db:migrate