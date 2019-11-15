FROM ruby:2.5.1-slim
ARG precompileassets

RUN apt-get update && apt-get install -y curl gnupg
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ stretch-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN curl -q https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

RUN apt-get -y update && \
      apt-get install --fix-missing --no-install-recommends -qq -y \
        build-essential \
        vim \
        wget gnupg \
        git-all \
        curl \
        ssh \
        postgresql-client-10 libpq5 libpq-dev -y && \
      wget -qO- https://deb.nodesource.com/setup_9.x  | bash - && \
      apt-get install -y nodejs && \
      apt-get clean && \
      rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENV NODE_ENV=production
ENV RAILS_ENV production
RUN gem install bundler -v 1.17.3
#Install gems
RUN mkdir /gems
WORKDIR /gems
COPY Gemfile .
COPY Gemfile.lock .
RUN bundle install
ARG INSTALL_PATH=/opt/lms
ENV INSTALL_PATH $INSTALL_PATH
WORKDIR $INSTALL_PATH
COPY . .

RUN bash
