class Rack::Attack
  # Use redis for caching
  Rack::Attack.cache.store = Rack::Attack::StoreProxy::RedisStoreProxy.new(Redis.current)

  # Throttle POST requests to login_through_ajax by email
  # Key: "rack::attack:#{Time.now.to_i/:period}:logins/email:#{req.email}"
  throttle('logins/email', limit: 10, period: 50.seconds) do |req|
    if req.path == '/session/login_through_ajax' && req.post?
    # return the email if present, nil otherwise
      req.params['user']['email'].presence
    end
  end
end
