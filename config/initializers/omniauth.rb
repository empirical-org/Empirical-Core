options = {provider_ignores_state: true}

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :clever, Clever::CLIENT_ID, Clever::CLIENT_SECRET, options
end

OmniAuth.config.logger = Rails.logger
OmniAuth.config.on_failure = Proc.new { |env|
  OmniAuth::FailureEndpoint.new(env).redirect_to_failure
} unless Rails.env.development?
