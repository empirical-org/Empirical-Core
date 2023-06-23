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
#  index_auth_credentials_on_refresh_token  (refresh_token)
#  index_auth_credentials_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

describe GoogleAuthCredential, type: :model do
  subject { create(:google_auth_credential) }

  it { should belong_to(:user) }

  it { is_expected.not_to be_canvas_authorized }
  it { is_expected.not_to be_clever_authorized }

  describe '#google_authorized?' do
    it { is_expected.to be_google_authorized }

    context 'nil expires_at' do
      before { subject.update(expires_at: nil) }

      it { is_expected.not_to be_google_authorized }
    end

    context 'nil refresh token' do
      before { subject.update(refresh_token: nil) }

      it { is_expected.not_to be_google_authorized }
    end

    context 'expired refresh token' do
      let(:expires_at) { Time.current - GoogleAuthCredential::EXPIRATION_DURATION - 1.month }

      before { subject.update(expires_at: expires_at) }

      it { is_expected.not_to be_google_authorized }
    end
  end

  describe '#refresh_token_expires_at' do
    it { expect(subject.refresh_token_expires_at).not_to be_nil }

    context 'nil expires_at' do
      before { subject.update(expires_at: nil) }

      it { expect(subject.refresh_token_expires_at).to be_nil }
    end
  end
end

