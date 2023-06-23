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
#  type          :string           not null
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
require 'rails_helper'

describe CanvasAuthCredential, type: :model do
  subject { create(:canvas_auth_credential) }

  it { should belong_to(:user) }
  it { should have_one(:canvas_instance_auth_credential).dependent(:destroy) }
  it { should have_one(:canvas_instance).through(:canvas_instance_auth_credential)}

  it { is_expected.not_to be_clever_authorized }
  it { is_expected.not_to be_google_authorized }

  describe '#canvas_authorized?' do
    it { is_expected.to be_canvas_authorized}

    context 'nil expires_at' do
      before { subject.update(expires_at: nil) }

      it { is_expected.not_to be_canvas_authorized }
    end

    context 'nil refresh token' do
      before { subject.update(refresh_token: nil) }

      it { is_expected.not_to be_canvas_authorized }
    end
  end
end

