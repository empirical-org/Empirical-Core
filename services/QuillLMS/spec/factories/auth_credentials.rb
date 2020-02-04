FactoryBot.define do
  factory :auth_credential do
    access_token 'fake_token'
    refresh_token 'fake_refresh_token'
    provider 'hooli'
    expires_at Time.now + 1.day
    user
  end
end
