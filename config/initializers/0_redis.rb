if Rails.env.test? || Rails.env.cypress? 
   require "fakeredis"
   require "redis/namespace"
   instance = Redis.new
   namespace = 'test'
   $redis = Redis::Namespace.new(namespace, :redis => instance)
else
  instance = Redis.new(url: ENV["REDISCLOUD_URL"])
  namespace = ENV["REDISCLOUD_NAMESPACE"]
  $redis = Redis::Namespace.new(namespace, :redis => instance)
end