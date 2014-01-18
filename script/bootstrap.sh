#!/usr/bin/env bash

# Install apt packages
sudo apt-get update
sudo apt-get install -y git postgresql-9.1 curl libxslt-dev libxml2-dev postgresql-server-dev-9.1 nodejs

# Drop and create the postgres cluster with the right encoding
sudo -u postgres pg_dropcluster --stop 9.1 main
sudo -u postgres pg_createcluster --start --locale en_US.UTF-8 9.1 main
sudo service postgresql start

# Get rvm
\curl -sSL https://get.rvm.io | bash -s stable --ruby=1.9.3
source /home/vagrant/.rvm/scripts/rvm

# Use 1.9.3 and create a gemset
rvm use 1.9.3
rvm gemset create quill

# Output rvm settings to the root of the project
echo "1.9.3" > /vagrant/.ruby-version
echo "quill" > /vagrant/.ruby-gemset

# Output database settings
echo "development:
    host: localhost
    adapter: postgresql
    encoding: unicode
    database: quill
    pool: 5
    username: quill
    password: devonly" > /vagrant/config/database.yml

# Create a database user
sudo -u postgres psql -c "CREATE ROLE quill PASSWORD 'devonly' CREATEDB INHERIT LOGIN"

# Output ruby env settings
echo "RAILS_ENV=development
APP_SECRET=dev-secret-key
HOMEPAGE_CHAPTER_ID=1" > /vagrant/.ruby-env

# cd into the project directory
cd /vagrant

# Update gems
bundle install

# Create the database and load fixtures
rake db:create
rake db:schema:load
rake db:seed
