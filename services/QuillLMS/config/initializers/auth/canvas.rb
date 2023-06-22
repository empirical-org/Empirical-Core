# frozen_string_literal: true

module Auth
  module Canvas
    OMNIAUTH_REQUEST_PATH = '/auth/canvas'
    OMNIAUTH_CALLBACK_PATH = '/auth/canvas/callback'
  end
end

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :canvas, setup: Auth::Canvas::Setup
end