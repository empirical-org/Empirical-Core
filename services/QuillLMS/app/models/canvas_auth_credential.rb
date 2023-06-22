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
class CanvasAuthCredential < AuthCredential
  has_one :canvas_instance_auth_credential,
    foreign_key: 'auth_credential_id',
    dependent: :destroy

  has_one :canvas_instance, through: :canvas_instance_auth_credential

  PROVIDER = 'canvas'

  def canvas_authorized?
    refresh_token_valid?
  end

  def refresh_token_valid?
    expires_at.present? && refresh_token.present?
  end

  def token
    access_token
  end
end
