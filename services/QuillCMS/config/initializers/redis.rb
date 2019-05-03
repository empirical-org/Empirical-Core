if Rails.env.test?
  namespace = 'test'
  ENV["REDISCLOUD_URL"] ||= 'test'
else
  namespace = ENV["REDISCLOUD_NAMESPACE"]
end

$redis = Redis::Namespace.new(namespace, :redis => Redis.new(url: ENV["REDISCLOUD_URL"]))
