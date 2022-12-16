# frozen_string_literal: true

class Rack::Attack
  # Use redis for caching
  Rack::Attack.cache.store = Rack::Attack::StoreProxy::RedisStoreProxy.new($redis.redis)

  Rack::Attack.throttle('limit logins per email', limit: 20, period: 10.minutes) do |req|
    if req.path == '/session/login_through_ajax' && req.post?
      # Important to use req.body.string here and not req.body.read,
      # since .read flushes the StringIO object (results in empty params hitting the controller)
      # https://ruby-doc.org/stdlib-2.6.4/libdoc/stringio/rdoc/StringIO.html
      params = JSON.parse( req.body.string )
      params['user']['email'].to_s.downcase.gsub(/\s+/, "")
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
    [503, {}, [{ message: 'Too many login attempts. Please try again later.', type: 'password' }.to_json]]
  end

end
