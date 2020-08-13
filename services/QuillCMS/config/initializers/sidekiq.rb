sidekiq_base_url = ENV['REDISCLOUD_URL'] || 'redis://localhost:6379'
sidekiq_url = "#{sidekiq_base_url}/2"

Sidekiq.configure_server do |config|
  config.redis = { url: sidekiq_url }
end

Sidekiq.configure_client do |config|
  Rails.application.config.after_initialize do
    UpdateElasticsearchWorker.perform_async
  end
  config.redis = { url: sidekiq_url }
end
