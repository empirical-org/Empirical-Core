# DOCKER-VERSION 0.9.0

FROM lgsd/docker-rails

MAINTAINER Quinn Shanahan q.shanahan@gmail.com

## For execjs — needs node
RUN apt-get update
RUN apt-get install -y python-software-properties python python-setuptools software-properties-common
RUN add-apt-repository ppa:chris-lea/node.js
RUN echo 'deb http://us.archive.ubuntu.com/ubuntu/ precise universe' >> /etc/apt/sources.list
RUN apt-get install -y nodejs
RUN apt-get install -y libxslt-dev libxml2-dev
RUN apt-get install -y libpq-dev

EXPOSE 3000
ADD . /app
RUN cd /app; bundle install
