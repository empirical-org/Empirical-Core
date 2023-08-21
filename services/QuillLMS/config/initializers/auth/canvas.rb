# frozen_string_literal: true

Rails.application.config.to_prepare { LMS::Canvas.auth_state_model = AuthCredential }

module Auth
  module Canvas
    OMNIAUTH_REQUEST_PATH = '/auth/canvas'
    OMNIAUTH_CALLBACK_PATH = '/auth/canvas/callback'

    REAUTHORIZATION_PATH = OMNIAUTH_REQUEST_PATH

    SCOPE_OPTIONS = %w[
      url:GET|/api/v1/courses
      url:GET|/api/v1/courses/:course_id/sections
      url:GET|/api/v1/courses/:course_id/sections/:id
      url:GET|/api/v1/sections/:id
      url:GET|/api/v1/courses
      url:GET|/api/v1/courses/:id
      url:GET|/api/v1/courses/:course_id/students
      url:GET|/api/v1/courses/:course_id/users
      url:GET|/api/v1/courses/:course_id/users/:id
      url:GET|/api/v1/users/:user_id/courses
      /auth/userinfo
    ].freeze
  end
end

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :canvas,
    setup: Auth::Canvas::Setup,
    scope: Auth::Canvas::SCOPE_OPTIONS.join(' ')
end
