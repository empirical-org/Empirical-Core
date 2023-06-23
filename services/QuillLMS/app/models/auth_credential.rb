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
class AuthCredential < ApplicationRecord
  belongs_to :user

  TYPES = %w[
    CanvasAuthCredential
    CleverDistrictAuthCredential
    CleverLibraryAuthCredential
    GoogleAuthCredential
  ].freeze

  validates :type, inclusion: { in: TYPES }

  def canvas_authorized?
    false
  end

  def clever_authorized?
    false
  end

  def google_access_expired?
    false
  end

  def google_authorized?
    false
  end
end
