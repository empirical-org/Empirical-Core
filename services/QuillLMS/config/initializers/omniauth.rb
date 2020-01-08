options = {provider_ignores_state: true}

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :clever, Clever::CLIENT_ID, Clever::CLIENT_SECRET, options
  provider :google_oauth2, ENV["GOOGLE_CLIENT_ID"], ENV["GOOGLE_CLIENT_SECRET"],
    {
      skip_jwt: true,
      scope: ['email',
              'profile',
              'classroom.courses.readonly',
              'classroom.announcements',
              'classroom.rosters.readonly',
              'classroom.profile.emails'],
      access_type: 'offline',
      prompt: 'consent'
    }
end

OmniAuth.config.logger = Rails.logger
unless Rails.env.development?
  OmniAuth.config.on_failure = proc { |env|
    OmniAuth::FailureEndpoint.new(env).redirect_to_failure
  }
end
