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
require 'rails_helper'

describe AuthCredential, type: :model do
  it { should belong_to(:user) }

  it { is_expected.not_to be_canvas_authorized }
  it { is_expected.not_to be_clever_authorized }
  it { is_expected.not_to be_google_access_expired }
  it { is_expected.not_to be_google_authorized }

  it { should validate_inclusion_of(:type).in_array(AuthCredential::TYPES) }
end

