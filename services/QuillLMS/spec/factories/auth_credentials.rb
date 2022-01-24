# frozen_string_literal: true

# == Schema Information
#
# Table name: auth_credentials
#
#  id            :integer          not null, primary key
#  access_token  :string           not null
#  expires_at    :datetime
#  provider      :string           not null
#  refresh_token :string
#  timestamp     :datetime
#  created_at    :datetime
#  updated_at    :datetime
#  user_id       :integer          not null
#
# Indexes
#
#  index_auth_credentials_on_provider       (provider)
#  index_auth_credentials_on_refresh_token  (refresh_token)
#  index_auth_credentials_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :auth_credential do
    access_token 'fake_token'
    refresh_token 'fake_refresh_token'
    provider 'hooli'
    expires_at 1.day.from_now
    user

    factory :google_auth_credential do
      provider AuthCredential::GOOGLE_PROVIDER
      expires_at AuthCredential::GOOGLE_EXPIRATION_DURATION.from_now
      association :user, factory: [:teacher, :signed_up_with_google]
    end

    factory :clever_district_auth_credential do
      provider AuthCredential::CLEVER_DISTRICT_PROVIDER
      expires_at AuthCredential::CLEVER_EXPIRATION_DURATION.from_now
      association :user, factory: [:teacher, :signed_up_with_clever]
    end

    factory :clever_library_auth_credential do
      provider AuthCredential::CLEVER_LIBRARY_PROVIDER
      expires_at AuthCredential::CLEVER_EXPIRATION_DURATION.from_now
      association :user, factory: [:teacher, :signed_up_with_clever]
    end
  end
end
