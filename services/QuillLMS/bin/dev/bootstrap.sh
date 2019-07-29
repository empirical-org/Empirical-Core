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
# TODO, edit script to use version 10.5, this is version 10.6 of Postgres
brew install postgresql@10
brew install redis
brew install rbenv
brew install ruby-build
brew tap homebrew/services

echo 'Install rbenv'
if which rbenv > /dev/null; then
  echo 'Already installed'
else
  echo "Error installing Rbenv" 1>&2
  exit 1
fi

RUBY_VERSION=$(rbenv local)

echo "Install Ruby $RUBY_VERSION"
if rbenv versions --bare | grep $RUBY_VERSION > /dev/null; then
  echo 'Already installed'
else
  rbenv install $RUBY_VERSION
fi

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

echo "Install Node"
if which nvm > /dev/null; then
  echo 'Already installed'
else
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
fi

source ~/.bashrc

nvm install

brew install npm
npm install

cd client && npm rebuild node-sass && cd ..

echo 'Copy config files'
# Note, -n is for 'no clobber', it won't overwrite if the file exists
cp -n config/database.yml.example config/database.yml
cp -n .env-sample .env

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

bundle exec rake db:setup RAILS_ENV=test
bundle exec rake db:migrate RAILS_ENV=test

echo 'install redis'
brew install redis
brew services restart redis

echo 'start server'
foreman start -f Procfile.dev
