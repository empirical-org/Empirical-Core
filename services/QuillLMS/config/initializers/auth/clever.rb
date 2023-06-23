# frozen_string_literal: true

module Auth
  module Clever
    CLIENT_ID = ENV['CLEVER_CLIENT_ID'] || '279109faf81350c2f429'
    CLIENT_SECRET = ENV['CLEVER_CLIENT_SECRET'] || '5f6b971a3d678dd35499f7e4f46d44ca56c0adb3'
    REDIRECT_URL = ENV['CLEVER_REDIRECT_URL'] || 'http://localhost:3000/auth/clever/callback'
    SCOPE = 'read:user'
  end
end

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :clever,
    Auth::Clever::CLIENT_ID,
    Auth::Clever::CLIENT_SECRET,
    get_user_info: true,
    provider_ignores_state: true
end
