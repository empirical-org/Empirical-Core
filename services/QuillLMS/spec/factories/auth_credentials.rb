# frozen_string_literal: true

# == Schema Information
#
# Table name: auth_credentials
#
#  id            :integer          not null, primary key
#  access_token  :string           not null
#  expires_at    :datetime
#  provider      :string
#  refresh_token :string
#  timestamp     :datetime
#  type          :string
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

    factory :canvas_auth_credential, parent: :auth_credential, class: :CanvasAuthCredential do
      provider CanvasAuthCredential::PROVIDER
    end

    factory :clever_district_auth_credential, parent: :auth_credential, class: :CleverDistrictAuthCredential do
      provider CleverDistrictAuthCredential::PROVIDER
      expires_at CleverDistrictAuthCredential::EXPIRATION_DURATION.from_now
      association :user, factory: [:teacher, :signed_up_with_clever]
    end

    factory :clever_library_auth_credential, parent: :auth_credential, class: :CleverLibraryAuthCredential do
      provider CleverLibraryAuthCredential::PROVIDER
      expires_at CleverLibraryAuthCredential::EXPIRATION_DURATION.from_now
      association :user, factory: [:teacher, :signed_up_with_clever]
    end

    factory :google_auth_credential, parent: :auth_credential, class: :GoogleAuthCredential do
      provider GoogleAuthCredential::PROVIDER
      expires_at GoogleAuthCredential::EXPIRATION_DURATION.from_now
      association :user, factory: [:teacher, :signed_up_with_google]

      trait(:expired) { expires_at GoogleAuthCredential::EXPIRATION_DURATION.ago }
    end
  end
end
