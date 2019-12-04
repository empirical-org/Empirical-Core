
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
ENV NODE_ENV=staging
ENV RAILS_ENV=staging

# ENVIRONMENT VARIABLES
ENV MIXPANEL_KEY=d78969d28cfb220c15752bdc85830b6e
ENV PUMA_WORKERS=1
ENV QUILL_CONNECT_URL=https://staging.connect.quill.org
ENV HEROKU_POSTGRESQL_GOLD_URL=postgres://u4r4n3vcbl52u5:pcbce40c72ea3aef6285a1f5f9cc8c7a326539cb210647568501a40fb8bc06f4a@ec2-52-207-69-8.compute-1.amazonaws.com:5432/d2ff4cq8rnp40s
ENV CDN_URL=https://assets.quill.org
ENV MEMCACHIER_SERVERS=mc3.dev.ec2.memcachier.com:11211
ENV LANG=en_US.UTF-8
ENV APP_SECRET=6d139815251ec01a824a73b31a6f9075ff69f295ca00a66285ac1d770c10541c567f548bcfc0a14479803105625767b108515cca2c5b87e273bad62253902e22
ENV QUILL_LESSONS_URL=https://stag-lessons.quill.org
ENV PROJECT_PATH=services/QuillLMS
ENV OLDPWD=/app/config
ENV SCOUT_MONITOR=true
ENV FIREBASE_DATABASE_URL=https://quillconnectstaging.firebaseio.com
ENV AWS_SECRET_ACCESS_KEY=Lq8Hd937iOcAuS/pLnO4Gbijt5utvYon1wNBNuv2
ENV FIREBASE_GRAMMAR_AUTH_DOMAIN=quillgrammarstaging.firebaseapp.com
ENV NODE_HOME=/app/.heroku/node
ENV SCOUT_LOG_LEVEL=WARN
ENV MEMCACHIER_PASSWORD=705A3909E3FB6B92A274ECF7C5C89095
ENV REDISCLOUD_URL=redis://rediscloud:iW9cWdPdZuXVIrl0@redis-17612.c13.us-east-1-3.ec2.cloud.redislabs.com:17612
ENV REDIS_PROVIDER=REDISTOGO_URL
ENV MAILGUN_SMTP_SERVER=smtp.mailgun.org
ENV PAPERTRAIL_API_TOKEN=OQ0Bg8mBr28YiNlffJh
ENV FIREBASE_API_KEY=AIzaSyAJNeVssNkcjNonREdRZ7gTyEDqmAfz7Go
ENV POINTPIN_KEY=3119a1b0-1290-47b4-90e3-bc3aa0734c3d
ENV MAILGUN_API_KEY=key-1h8o97tzlogagtd4finvh79h60xovbh7
ENV ASSET_SYNC_EXISTING_REMOTE_FILES=keep
ENV AMPLIFY_SHARED_SECRET_KEY=f03a609897be15fda3e26769978e2196
ENV KEEN_PROJECT_ID=5420a8eebcb79c3a552c5cb4
ENV CLOUDFRONT_CACHE_URL=//d2jzcnuic6l1sf.cloudfront.net
ENV LESSONS_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----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-----END RSA PRIVATE KEY-----"

ENV NODE_ENV=staging
ENV CLEVER_REDIRECT_URL=https://quill-lms-sprint-docker.herokuapp.com/auth/clever/callback
ENV STRIPE_SECRET_KEY=sk_test_dGcZ67ppOzdW6dDOrMIYpucw
ENV MAILGUN_SMTP_PORT=587
ENV WEB_MEMORY=512
ENV CMS_URL=https://cms.quill.org
ENV NEW_RELIC_LICENSE_KEY=0c9ecc1906ac642571ccdcd3b8084fbfa2bf2d76
ENV FIREBASE_STORAGE_BUCKET=quillconnectstaging.appspot.com
ENV DYNO=run.3561
ENV FIREBASE_AUTH_DOMAIN=quillconnectstaging.firebaseapp.com
ENV ASSET_SYNC_MANIFEST=true
ENV PUSHER_APP_ID=325357
ENV CONNECT_URL=https://quillconnect.firebaseapp.com
ENV MIN_THREADS=1
ENV INTERCOM_APP_SECRET=y9q840Sl4fM6dep0PTbuZJXMAcoun0HcqH6nIJOj
ENV PUSHER_KEY=d4ced53f0113cb174102
ENV NEW_RELIC_LOG=stdout
ENV MAILCHIMP_API_KEY=ee8f80164d1abb1e19afe9f812034a9c-us3
ENV PWD=/app
ENV LINES=46
ENV HOME=/app
ENV KEEN_WRITE_KEY=6df85b472b268c588f54ca3fc1b589b3a83365b0ff9c91681526860ff607e43b74dbfd6448d0a8ae20f0a3bed20d9c00e2c4996eac3f7484eecf441e58e65e81bb23ede534f6549b0ea2c755fddb0c2958af4a20303dd740e36f9b7ead7c8fc550af3cdccbc14ccd88ffd34d8cc50ed4
ENV RAILS_SERVE_STATIC_FILES=enabled
ENV FIREBASE_GRAMMAR_STORAGE_BUCKET=quillgrammarstaging.appspot.com
ENV GOOGLE_CLIENT_SECRET=RCp2V-342H_SA6sPLVwf95IR
ENV FIREBASE_GRAMMAR_API_KEY=AIzaSyCb_V_wX_ftJNy6Q5x9NsuGrRvnC7_0zSU
ENV QUILL_API_URL=https://quill-lms-sprint-docker.herokuapp.com/api/v1
ENV DATABASE_URL=postgres://uaofkc979ecphe:p47e3778cfe7a1d3af282f3cfc00300b91a71153fbe8ce6df4999759a6f71a42c@ec2-34-233-255-235.compute-1.amazonaws.com:5432/d2ff4cq8rnp40s
ENV GOOGLE_CLIENT_ID=81778652204-bd3m1t64117arrutdbv105pr5mb2kjdj.apps.googleusercontent.com
ENV SCOUT_KEY=DOLHJIjaAOlPk861dc9J
ENV MAINTENANCE_PAGE_URL=https://s3.amazonaws.com/compass-files/maintenance_mode.html
ENV STRIPE_PUBLIC_KEY=pk_test_1DcdMAZJOFtEhqyV496DUvZs
ENV GEM_PATH=/app/vendor/bundle/ruby/2.5.0:
ENV PORT=26716
ENV SALESMACHINE_API_KEY=0rOw7rcFl_RgdOCgf_MUog
ENV DEFAULT_URL=https://quill-lms-sprint-docker.herokuapp.com.quill.org
ENV MEMORY_AVAILABLE=512
ENV SEGMENT_WRITE_KEY=ql0Fd2XPDECPs9XIi6xjWdfuylehBF8m
ENV FOG_PROVIDER=AWS
ENV RAILS_ENV=staging
ENV FONT_AWESOME_KIT_LINK=https://kit.fontawesome.com/a149fb25a6.js
ENV SENDGRID_KEY=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
ENV APP_NAME=quill-lms-sprint-docker
ENV COLUMNS=183
ENV ASSET_SYNC_GZIP_COMPRESSION=true
ENV TERM=xterm-256color
ENV REDISTOGO_URL=redis://redistogo:76cc754b2dc28e91126467325aff2627@dory.redistogo.com:10055/
ENV KEEN_READ_KEY=7741e9b510ef96ca3a4f1f84793418b1a51eabb1d0e1cace44e383c6417e2b351002ae56447cfea0df64ccb8aa2625485260e0907911e842f06e2b16bbf680d58311d593fb66f9791020009290a426c824e023d838a7d698a66a10b6539fa5e88f29b82553de9fe1a652a3f8eff955df
ENV RACK_ENV=staging
ENV FIREBASE_GRAMMAR_DATABASE_URL=https://quillgrammarstaging.firebaseio.com
ENV REDISCACHE_NAMESPACE='sprint-docker'
ENV MAILGUN_SMTP_PASSWORD=6zorptmbjry0
ENV WEB_CONCURRENCY=1
ENV PROGRESS_REPORT_FOG_DIRECTORY=empirical-progress-report-staging
ENV AWS_ACCESS_KEY_ID=AKIAIN5VWLKS7CLMDVFQ
ENV SHLVL=2
ENV PUSHER_SECRET=04c0e0bae923c3b9e89c
ENV SENTRY_DSN=https://7234ec67e087437f80cd7a59b592e2fc:ccc5973214034bfe9b69aad00e4c1ed0@app.getsentry.com/18492
ENV MEMCACHIER_USERNAME=3665A6
ENV SENDGRID_PASSWORD=xjoixh2t0494
ENV SENDGRID_USERNAME=app17665009@heroku.com
ENV INTERCOM_ACCESS_TOKEN=dG9rOmMzMjk1ZWJiX2MwYWVfNDQwMF9iZDM2X2NjODdkYTlkMmE1MzoxOjA=
ENV PATH=/app/bin:/app/vendor/bundle/bin:/app/vendor/bundle/ruby/2.5.0/bin:vendor/yarn-v1.16.0/bin/:/app/.heroku/node/bin:/app/.heroku/yarn/bin:/usr/local/bin:/usr/bin:/bin:/app/bin:/app/node_modules/.bin
#ENV PS1="\[\033[01;34m\]\w\[\033[00m\] \[\033[01;32m\]$ \[\033[00m\]""
ENV NEW_RELIC_AGENT_ENABLED=false
ENV FOG_DIRECTORY=empirical-core-staging
ENV MAILGUN_SMTP_LOGIN=postmaster@app13359946.mailgun.org
ENV SECRET_KEY_BASE=4f85d2b01ba607f57a5311028c9e2feccb96982a23cb03c771100bfe4aeb59879e0bd3a3508b6d6ae2257jyvdt68ka42a4c4d7df65d1ff1ab4a54abd359
ENV FOG_REGION=us-east-1
ENV MAX_THREADS=1

COPY Gemfile .
COPY Gemfile.lock .
RUN gem install bundler -v 1.17.3
RUN bundle install
WORKDIR $INSTALL_PATH
RUN cd ./client && nohup npm install > npm_install_log.out 2>&1 &
RUN cd ./client && nohup npm run build:client && nohup run build:server > npm_build_log.out 2>&1 &
RUN rake assets:precompile
RUN rake assets:clean
RUN bash
