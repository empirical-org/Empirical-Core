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
require 'spec_helper'

describe CleverDistrictAuthCredential, type: :model do
  subject { build(:clever_district_auth_credential) }

  it { should belong_to(:user) }

  it { is_expected.to be_clever_authorized }

  it { is_expected.not_to be_canvas_authorized }
  it { is_expected.not_to be_google_authorized }

  context 'expires_at is nil' do
    subject { build(:clever_library_auth_credential, expires_at: nil) }

    it { is_expected.not_to be_clever_authorized }
  end

  context 'expires_at is in the past' do
    subject { build(:clever_library_auth_credential, expires_at: 1.day.ago) }

    it { is_expected.not_to be_clever_authorized }
  end
end

