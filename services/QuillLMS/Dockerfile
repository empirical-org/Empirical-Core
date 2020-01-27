
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

ARG INSTALL_PATH=/app
ENV INSTALL_PATH $INSTALL_PATH
WORKDIR $INSTALL_PATH
COPY . .
RUN mkdir /config
ADD ./config/ /config/
ADD ./Rakefile /Rakefile
WORKDIR $INSTALL_PATH
ENV NODE_ENV=development
ENV RAILS_ENV=production
ENV RACK_ENV=production
ENV SALESMACHINE_API_KEY=EMPTY_KEY
COPY Gemfile .
COPY Gemfile.lock .
RUN gem install bundler -v 1.17.3
RUN bundle install
WORKDIR $INSTALL_PATH
RUN rm -rf package-lock.json
RUN npm rebuild node-sass
RUN npm install
RUN cd ./client && npm rebuild node-sass && rm -rf package-lock.json && npm install 
RUN cd ./client && npm run build:client && npm run build:server || true
RUN rake assets:precompile
RUN rake assets:clean
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
