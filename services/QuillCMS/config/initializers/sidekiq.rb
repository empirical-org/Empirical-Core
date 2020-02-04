sidekiq_base_url = ENV['REDISCLOUD_URL'] || 'redis://localhost:6379'
sidekiq_url = "#{sidekiq_base_url}/2"

class StickToLeaderDbSidekiqMiddleware
  def call(worker, msg, queue)
    ActiveRecord::Base.connection.stick_to_master!
    yield
  end
end

Sidekiq.configure_server do |config|
  config.redis = { url: sidekiq_url }
  config.server_middleware do |chain|
    chain.add(StickToLeaderDbSidekiqMiddleware)
  end
end

Sidekiq.configure_client do |config|
  config.redis = { url: sidekiq_url }
end
