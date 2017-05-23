if Rails.env.test?
  namespace = 'test'
else
  namespace = ENV["REDISCACHE_NAMESPACE"]
end

$redis = Redis::Namespace.new(namespace, :redis => Redis.new(url: ENV["REDISCACHE_URL"]))
