web: bundle exec puma -C ./config/puma.rb
worker: bundle exec sidekiq -c 5 -v

# Build client assets, watching for changes.
rails-client-assets: sh -c 'npm run build:dev:client'

# Build server assets, watching for changes. Remove if not server rendering.
rails-server-assets: sh -c 'npm run build:dev:server'
