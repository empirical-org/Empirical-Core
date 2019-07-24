web: bundle exec puma -C ./config/puma.rb
worker: bundle exec sidekiq -q default -q critical
reportworker: bundle exec sidekiq -q low
