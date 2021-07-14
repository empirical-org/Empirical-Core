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
class AuthCredential < ApplicationRecord
  belongs_to :user

  GOOGLE_PROVIDER = 'google'.freeze
  EXPIRATION_DURATION = 6.months

  def google_authorized?
    provider == GOOGLE_PROVIDER && refresh_token_valid?
  end

  def refresh_token_valid?
    return false if expires_at.nil? || refresh_token.nil?

    Time.now < refresh_token_expires_at
  end

  def refresh_token_expires_at
    expires_at + EXPIRATION_DURATION
  end
end
