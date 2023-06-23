# frozen_string_literal: true

OmniAuth.config.logger = Rails.logger

unless Rails.env.development?
  OmniAuth.config.on_failure = proc { |env| OmniAuth::FailureEndpoint.new(env).redirect_to_failure }
end
