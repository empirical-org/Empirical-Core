current_directory=`echo ${PWD##/} | awk -F"/" '{print $(NF-1)"/"$(NF);}'`
if [ "$current_directory" != "services/QuillLMS" ]
then
  echo "You must run the bootstrap script from the QuillLMS root directory."
  exit 1
fi

[ ! -d '/Applications/Postgres.app' ] && echo 'Please make sure Postgres.app is installed. Use the version "Postgres.app with all currently supported versions" on this page: https://postgresapp.com/downloads.html so that you use Postgres 10. Exiting.' && exit 1

postgres_already_running_msg="It looks like you have a non-Postgres.app version \n
of postgres already running. Try running \n
pg_ctl -D /usr/local/var/postgresql@10 \n
to gracefully stop this process."

ps -ef | grep '/usr/local/opt/postgresql' | grep -v grep > /dev/null
[ $? -eq 0 ] && echo -e $postgres_already_running_msg

echo 'Copy git hooks'
cp ../../hooks/* ../../.git/hooks/

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
brew install redis
brew install rbenv
brew install ruby-build
brew install readline
brew install libyaml
brew install shared-mime-info
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
echo 'eval "$(rbenv init -)"' >> ~/.zprofile
source ~/.zprofile
cd .
rbenv rehash

# reset terminal
touch ~/.bashrc
source ~/.bashrc

# install heroku cli
echo "Install and configure heroku cli"
brew tap heroku/brew && brew install heroku

# heroku login
heroku login

# add heroku remotes
git remote add quill-lms-staging https://git.heroku.com/empirical-grammar-staging.git
git remote add quill-lms-sprint  https://git.heroku.com/quill-lms-sprint.git
git remote add quill-lms-prod  https://git.heroku.com/empirical-grammar.git

echo 'Install Bundler'
# there are breaking changes in bundler 2.0, so pin to this version for now.
gem install bundler -v 2.2.33
gem install foreman -v 0.87.2

# set bundle config, needed for sidekiq-pro
export BUNDLE_GEMS__CONTRIBSYS__COM=$(heroku config:get BUNDLE_GEMS__CONTRIBSYS__COM -a empirical-grammar)
bundle config --local gems.contribsys.com $BUNDLE_GEMS__CONTRIBSYS__COM

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
cd .
nvm install

brew install npm
npm install

cd client && npm rebuild node-sass && cd ..

echo 'Copy config files'
# Note, -n is for 'no clobber', it won't overwrite if the file exists
cp -n .env-sample .env

### homebrew postgres installation. ###################
# Uncomment if you don't want to use Postgres.app
# brew install postgresql@10
# brew services restart postgresql@10
# echo 'export PATH="/usr/local/opt/postgresql@10/bin:$PATH"' >> ~/.zprofile
# export PKG_CONFIG_PATH="/usr/local/opt/postgresql@10/lib/pkgconfig"

# echo 'create the app DB user quill_dev and quill_test'
# # Ideally, this would be more restrictive (shouldn't need a superuser), but would need some DB edits
# createuser quill_dev --superuser
# createuser quill_test --superuser
### homebrew postgres installation #####################

echo 'set up app DB, migrate database'
bundle exec rake db:setup
bundle exec rake db:migrate

bundle exec rake db:setup RAILS_ENV=test
bundle exec rake db:migrate RAILS_ENV=test

echo 'install redis'
brew install redis
brew services restart redis

echo 'start server'
foreman start -f Procfile.static
