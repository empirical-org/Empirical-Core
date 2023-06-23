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
class GoogleAuthCredential < AuthCredential
  EXPIRATION_DURATION = 6.months
  PROVIDER = 'google'

  def google_access_expired?
    !refresh_token_valid?
  end

  def google_authorized?
    refresh_token_valid?
  end

  def refresh_token_expires_at
    return nil if expires_at.nil?

    expires_at + EXPIRATION_DURATION
  end

  def refresh_token_valid?
    return false if expires_at.nil? || refresh_token.nil?

    Time.current < refresh_token_expires_at
  end
end
