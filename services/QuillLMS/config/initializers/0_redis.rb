# frozen_string_literal: true

if Rails.env.test?
  namespace = 'test'
  ENV["REDISCLOUD_URL"] = 'redis://localhost:6378/0'
else
  namespace = ENV["REDISCLOUD_NAMESPACE"]
end

$redis = Redis::Namespace.new(namespace, :redis => Redis.new(url: ENV["REDISCLOUD_URL"]))
