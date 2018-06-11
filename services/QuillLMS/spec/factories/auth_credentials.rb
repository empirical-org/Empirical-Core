FactoryBot.define do
  factory :auth_credential do
    access_token 'fake_token'
    provider 'hooli'
  end
end
