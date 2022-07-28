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
class AuthCredential < ApplicationRecord
  belongs_to :user

  GOOGLE_PROVIDER = 'google'
  GOOGLE_EXPIRATION_DURATION = 6.months

  CLEVER_DISTRICT_PROVIDER = 'clever_district'
  CLEVER_LIBRARY_PROVIDER = 'clever_library'
  CLEVER_EXPIRATION_DURATION = 23.hours

  def google_access_expired?
    google_provider? && !refresh_token_valid?
  end

  def google_authorized?
    google_provider? && refresh_token_valid?
  end

  def google_provider?
    provider == GOOGLE_PROVIDER
  end

  def clever_authorized?
    [CLEVER_DISTRICT_PROVIDER, CLEVER_LIBRARY_PROVIDER].include?(provider)
  end

  def refresh_token_valid?
    return false if !google_provider? || expires_at.nil? || refresh_token.nil?

    Time.current < refresh_token_expires_at
  end

  def refresh_token_expires_at
    return nil if !google_provider?

    expires_at + GOOGLE_EXPIRATION_DURATION
  end
end
