# frozen_string_literal: true

# == Schema Information
#
# Table name: auth_credentials
#
#  id            :integer          not null, primary key
#  access_token  :string           not null
#  expires_at    :datetime
#  refresh_token :string
#  timestamp     :datetime
#  type          :string           not null
#  created_at    :datetime
#  updated_at    :datetime
#  user_id       :integer          not null
#
# Indexes
#
#  index_auth_credentials_on_refresh_token  (refresh_token)
#  index_auth_credentials_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class CleverDistrictAuthCredential < AuthCredential
  EXPIRATION_DURATION = 23.hours
  PROVIDER = 'clever_district'

  def clever_authorized?
    true
  end
end
