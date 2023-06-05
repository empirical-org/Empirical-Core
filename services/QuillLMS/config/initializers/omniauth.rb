# frozen_string_literal: true

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :clever,
    Clever::CLIENT_ID,
    Clever::CLIENT_SECRET,
    get_user_info: true,
    provider_ignores_state: true
end

OmniAuth.config.logger = Rails.logger

unless Rails.env.development?
  OmniAuth.config.on_failure = proc { |env| OmniAuth::FailureEndpoint.new(env).redirect_to_failure }
end
