sidekiq_base_url = ENV['REDISCLOUD_URL'] || 'redis://localhost:6379'
sidekiq_url = "#{sidekiq_base_url}/2"

Sidekiq.configure_server do |config|
  config.redis = { url: sidekiq_url }
end

Sidekiq.configure_client do |config|
  config.redis = { url: sidekiq_url }
end


module SidekiqQueue
  # QUEUE DEFINITIONS
  CRITICAL = 'critical'
  DEFAULT = 'default'
  # LOW: Jobs that might be long-running that we don't want to clog up the main workers
  # and that can be delayed.
  LOW = 'low'
end
