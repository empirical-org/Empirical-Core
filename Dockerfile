# DOCKER-VERSION 0.9.0

FROM lgsd/docker-rails

MAINTAINER Quinn Shanahan q.shanahan@gmail.com

## For execjs — needs node
RUN apt-get update
RUN apt-get install -y python-software-properties python python-setuptools software-properties-common
RUN add-apt-repository ppa:chris-lea/node.js
RUN echo 'deb http://us.archive.ubuntu.com/ubuntu/ precise universe' >> /etc/apt/sources.list
RUN apt-get install -y nodejs

ADD . /app

RUN apt-get install -y libxslt-dev libxml2-dev
RUN apt-get install -y libpq-dev
RUN cd /app; bundle install

EXPOSE 3000
