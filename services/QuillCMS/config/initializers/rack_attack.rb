# frozen_string_literal: true

class Rack::Attack

  ### Configure Cache ###

  # If you don't want to use Rails.cache (Rack::Attack's default), then
  # configure it here.
  #
  # Note: The store is only used for throttling (not blocklisting and
  # safelisting). It must implement .increment and .write like
  # ActiveSupport::Cache::Store

  # Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  EXACT_BLOCK_PATHS = [
    '/shell',
    '/boaform/admin/formLogin',
    '/GponForm/diag_Form',
    '/actuator/health',
    '/config/getuser',
    '/owa',
    '/ads.txt',
    '/well-known/security.txt'
  ].freeze

  REGEX_BLOCK_PATHS = [
    /\.php/,
    /\.aspx/,
    /\.git/,
    /\.cgi/,
    /\.env/,
    /wp-admin/,
    /wp-login/,
    /wp-content/,
    /phpmyadmin/,
    /phpinfo/,
    /jsonws/,
    /readme/,
    /_ignition/,
    /redlion/,
    /passwd/
  ].freeze

  Rack::Attack.blocklist('pentesters') do |request|
    # Note on Fail2Ban (https://github.com/rack/rack-attack#fail2ban)
    # This code will block all BLOCK_PATH matching requests (this is the 'Fail')
    # If a single IP causes 3 blocks of this type in 10 minutes,
    # then ALL requests from that IP are blocked for 60.minutes (this is the 'Ban')
    # i.e. Fail -> Ban
    Rack::Attack::Fail2Ban.filter("pentesters-#{request.ip}", maxretry: 3, findtime: 10.minutes, bantime: 60.minutes) do
      # The count for the IP is incremented if the return value is truthy
      EXACT_BLOCK_PATHS.any?(request.path) ||
        REGEX_BLOCK_PATHS.any? {|regex| regex.match?(request.path)}
    end
  end
end
