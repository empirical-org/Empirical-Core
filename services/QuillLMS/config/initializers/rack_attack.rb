# frozen_string_literal: true

class Rack::Attack
  # Use redis for caching
  Rack::Attack.cache.store = Rack::Attack::StoreProxy::RedisStoreProxy.new($redis.redis)

  BLOCKLIST_REGEX_STRING = ENV.fetch('RACK_ATTACK_BLOCKLIST_REGEX', '')
  BLOCKLIST_REGEX = BLOCKLIST_REGEX_STRING.present? ? Regexp.new(BLOCKLIST_REGEX_STRING) : nil
  # Using 503 because it may make attacker think that they have successfully
  # DOSed the site. Rack::Attack returns 429 for throttling by default
  BLOCKLIST_RESPONSE = [503, {}, [{ message: 'Too many attempts. Please try again later.'}.to_json]].freeze
  THROTTLE_RESPONSE = [503, {}, [{ message: 'Too many attempts. Please try again later.', type: 'password' }.to_json]].freeze

  Rack::Attack.throttle('limit logins per email', limit: 20, period: 10.minutes) do |req|
    if req.path == '/session/login_through_ajax' && req.post?
      # Important to use req.body.string here and not req.body.read,
      # since .read flushes the StringIO object (results in empty params hitting the controller)
      # https://ruby-doc.org/stdlib-2.6.4/libdoc/stringio/rdoc/StringIO.html
      params = JSON.parse( req.body.string )
      params['user']['email'].to_s.downcase.gsub(/\s+/, "")
    end
  end

  Rack::Attack.blocklist('block bad urls') do |req|
    req.get? &&
      BLOCKLIST_REGEX.present? &&
      req.path != '/404' &&
      req.path != '/500' &&
      req.path.match?(BLOCKLIST_REGEX)
  end

  Rack::Attack.throttled_response = lambda do |request|
    # NB: you have access to the name and other data about the matched throttle
    #  request.env['rack.attack.matched'],
    #  request.env['rack.attack.match_type'],
    #  request.env['rack.attack.match_data'],
    #  request.env['rack.attack.match_discriminator']
    THROTTLE_RESPONSE
  end

  Rack::Attack.blocklisted_response = lambda do |request|
    BLOCKLIST_RESPONSE
  end

end
