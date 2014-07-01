# DOCKER-VERSION 0.9.0

FROM empirical/compass_base

MAINTAINER Quinn Shanahan q.shanahan@gmail.com

EXPOSE 3000
ADD . /app
WORKDIR /app
RUN bundle install
