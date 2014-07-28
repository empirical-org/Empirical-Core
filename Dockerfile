# DOCKER-VERSION 0.9.0
 
FROM ruby:latest
 
MAINTAINER Quinn Shanahan q.shanahan@gmail.com
# http://www.activestate.com/blog/2014/01/using-docker-run-ruby-rspec-ci-jenkins
 
RUN apt-get update && apt-get install -y postgresql-client-9.3 nodejs
 
EXPOSE 3000
 
ONBUILD ADD . /usr/src/app
ONBUILD WORKDIR /usr/src/app
ONBUILD RUN [ ! -e Gemfile ] || bundle install --system
 
CMD rails s

# empirical/rails b35e23d2dbb5
