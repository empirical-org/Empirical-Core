OMNI_AUTH_OPTIONS = { provider_ignores_state: true }.freeze

CLEVER_OMNI_AUTH_OPTIONS = {}.merge(OMNI_AUTH_OPTIONS).freeze

GOOGLE_SCOPE_OPTIONS = [
  'classroom.announcements',
  'classroom.courses.readonly',
  'classroom.profile.emails',
  'classroom.rosters.readonly',
  'email',
  'profile'
].freeze

GOOGLE_AUTHORIZATION_AND_AUTHENTICATION_OPTIONS = {
  name: 'google_oauth2',
  access_type: 'offline',
  prompt: 'consent',
  scope: GOOGLE_SCOPE_OPTIONS,
  skip_jwt: true
}.merge(OMNI_AUTH_OPTIONS).freeze

GOOGLE_AUTHENTICATION_ONLY_OPTIONS = {
  name: 'google_oauth2_authentication_only',
  scope: GOOGLE_SCOPE_OPTIONS,
  skip_jwt: true
}.merge(OMNI_AUTH_OPTIONS).freeze

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :clever,
    Clever::CLIENT_ID,
    Clever::CLIENT_SECRET,
    CLEVER_OMNI_AUTH_OPTIONS

  provider :google_oauth2,
    ENV["GOOGLE_CLIENT_ID"],
    ENV["GOOGLE_CLIENT_SECRET"],
    GOOGLE_AUTHENTICATION_ONLY_OPTIONS

  provider :google_oauth2,
    ENV["GOOGLE_CLIENT_ID"],
    ENV["GOOGLE_CLIENT_SECRET"],
    GOOGLE_AUTHORIZATION_AND_AUTHENTICATION_OPTIONS
end

OmniAuth.config.logger = Rails.logger

unless Rails.env.development?
  OmniAuth.config.on_failure = proc { |env| OmniAuth::FailureEndpoint.new(env).redirect_to_failure }
end
