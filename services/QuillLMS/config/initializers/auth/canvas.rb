# frozen_string_literal: true

Rails.application.config.to_prepare { LMS::Canvas.auth_state_model = AuthCredential }

module Auth
  module Canvas
    OMNIAUTH_REQUEST_PATH = '/auth/canvas'
    OMNIAUTH_CALLBACK_PATH = '/auth/canvas/callback'

    REAUTHORIZATION_PATH = OMNIAUTH_REQUEST_PATH
  end
end

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :canvas, setup: Auth::Canvas::Setup
end
