if Rails.env.test? || Rails.env.cypress?
  puts "IN HERE!!!"
  require 'fakeredis'
  require 'redis/namespace'
  redis_conn = proc {
    instance = Redis.new
    namespace = 'side'
    Redis::Namespace.new(namespace, :redis => instance)
  }
  Sidekiq.configure_client do |config|
    config.redis = ConnectionPool.new(size: 5, &redis_conn)
  end
  Sidekiq.configure_server do |config|
    config.redis = ConnectionPool.new(size: 25, &redis_conn)
  end
end