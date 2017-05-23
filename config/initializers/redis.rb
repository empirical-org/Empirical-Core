case
when Rails.env.test?
  namespace = 'test'
when Rails.env.development?
  namespace = 'development'
end



$redis = Redis::Namespace.new(namespace, :redis => Redis.new(url: 'redis://localhost:7654'))
