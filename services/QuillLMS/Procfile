web: bundle exec puma -C ./config/puma.rb

# Note, using MALLOC_ARENA_MAX=2 based on this article:
# https://github.com/mperham/sidekiq/wiki/Deployment#heroku

worker: MALLOC_ARENA_MAX=2 bundle exec sidekiq -q critical -q critical_external -q default

reportworker: MALLOC_ARENA_MAX=2 bundle exec sidekiq -q default -q low -q critical -q critical_external

# Backup workers that we can use in case we need to isolate external jobs from the queue
externalworker: MALLOC_ARENA_MAX=2 bundle exec sidekiq -q critical_external

internalworker: MALLOC_ARENA_MAX=2 bundle exec sidekiq -q critical -q default

# Migration workers to be turned on only in cases where we have complex migration jobs to process
migrationworker: MALLOC_ARENA_MAX=2 bundle exec sidekiq -q migration
