# frozen_string_literal: true

module Auth
  module Google
    SCOPE_OPTIONS = [
      'classroom.announcements',
      'classroom.courses.readonly',
      'classroom.profile.emails',
      'classroom.rosters.readonly',
      'email',
      'profile'
    ].freeze

    ONLINE_ACCESS_NAME = 'google/online_access'
    ONLINE_ACCESS_PATH = "/auth/#{ONLINE_ACCESS_NAME}"
    ONLINE_ACCESS_CALLBACK_PATH = "#{ONLINE_ACCESS_PATH}/callback"

    OFFLINE_ACCESS_NAME ='google/offline_access'
    OFFLINE_ACCESS_PATH = "/auth/#{OFFLINE_ACCESS_NAME}"
    OFFLINE_ACCESS_CALLBACK_PATH = "#{OFFLINE_ACCESS_PATH}/callback"
  end
end

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :clever,
    Clever::CLIENT_ID,
    Clever::CLIENT_SECRET,
    get_user_info: true,
    provider_ignores_state: true

  provider :google_oauth2,
    ENV["GOOGLE_CLIENT_ID"],
    ENV["GOOGLE_CLIENT_SECRET"],
    access_type: 'online',
    name: Auth::Google::ONLINE_ACCESS_NAME,
    provider_ignores_state: true,
    scope: Auth::Google::SCOPE_OPTIONS,
    skip_jwt: true

  provider :google_oauth2,
    ENV["GOOGLE_CLIENT_ID"],
    ENV["GOOGLE_CLIENT_SECRET"],
    access_type: 'offline',
    name: Auth::Google::OFFLINE_ACCESS_NAME,
    prompt: 'consent',
    provider_ignores_state: true,
    scope: Auth::Google::SCOPE_OPTIONS,
    skip_jwt: true
end

OmniAuth.config.logger = Rails.logger

unless Rails.env.development?
  OmniAuth.config.on_failure = proc { |env| OmniAuth::FailureEndpoint.new(env).redirect_to_failure }
end
