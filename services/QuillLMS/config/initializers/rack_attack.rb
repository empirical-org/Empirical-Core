class Rack::Attack
  # Use redis for caching
  Rack::Attack.cache.store = Rack::Attack::StoreProxy::RedisStoreProxy.new($redis.redis)

  Rack::Attack.throttle('limit logins per email', limit: 6, period: 30.minutes) do |req|
    if req.path == '/session/login_through_ajax' && req.post?
      params = JSON.parse( req.body.read )
      params['user']['email'].to_s.downcase.gsub(/\s+/, "")
    end
  end

  Rack::Attack.throttle('limit logins per ip', limit: 6, period: 30.minutes) do |req|
    if req.path == '/session/login_through_ajax' && req.post?
      req.ip
    end
  end

  Rack::Attack.throttled_response = lambda do |request|
  # NB: you have access to the name and other data about the matched throttle
  #  request.env['rack.attack.matched'],
  #  request.env['rack.attack.match_type'],
  #  request.env['rack.attack.match_data'],
  #  request.env['rack.attack.match_discriminator']

  # Using 503 because it may make attacker think that they have successfully
  # DOSed the site. Rack::Attack returns 429 for throttling by default
    [503, {}, [ { message: 'Too many login attempts. Please try again later.', type: 'password' }.to_json ]]
  end

end
