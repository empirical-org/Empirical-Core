options = { provider_ignores_state: true }

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :clever, Clever::CLIENT_ID, Clever::CLIENT_SECRET, options
  provider :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET'],
           scope: %w(email profile), access_type: 'offline'
end

OmniAuth.config.logger = Rails.logger
OmniAuth.config.on_failure = proc { |env|
  OmniAuth::FailureEndpoint.new(env).redirect_to_failure
} unless Rails.env.development?
