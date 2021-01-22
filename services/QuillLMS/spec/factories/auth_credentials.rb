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
#  index_auth_credentials_on_access_token   (access_token)
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
    expires_at Time.now + 1.day
    user
  end
end
