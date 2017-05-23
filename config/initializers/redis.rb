$redis = Redis::Namespace.new("site_point", :redis => Redis.new(url: 'redis://localhost:7654'))
