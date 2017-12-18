class Rack::Attack
  # Use redis for caching
  Rack::Attack.cache.store = Rack::Attack::StoreProxy::RedisStoreProxy.new($redis.redis)

  # Throttle POST requests to login_through_ajax by email
  # Key: "rack::attack:#{Time.now.to_i/:period}:logins/email:#{req.email}"
  throttle('logins/email', limit: 20, period: 60.seconds) do |req|
    if req.path == '/session/login_through_ajax' && req.post?
      params = JSON.parse(req.body.read)
      params['user']['email'].presence
    end
  end
end
