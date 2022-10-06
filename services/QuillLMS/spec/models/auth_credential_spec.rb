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
require 'rails_helper'

describe AuthCredential, type: :model do
  it { should belong_to(:user) }

  let(:auth_credential) { create(factory) }

  context described_class::GOOGLE_PROVIDER do
    let(:factory) { :google_auth_credential }

    describe '#google_authorized?' do
      context 'nil expires_at' do
        before { auth_credential.update(expires_at: nil) }

        it { should_not_be_clever_authorized}
        it { should_not_be_google_authorized }
      end

      context 'nil refresh token' do
        before { auth_credential.update(refresh_token: nil) }

        it { should_not_be_clever_authorized}
        it { should_not_be_google_authorized }
      end

      context 'expired refresh token' do
        let(:expires_at) { Time.current - AuthCredential::GOOGLE_EXPIRATION_DURATION - 1.month }

        before { auth_credential.update(expires_at: expires_at) }

        it { should_not_be_clever_authorized}
        it { should_not_be_google_authorized }
      end
    end

    describe '#refresh_token_expires_at' do
      it { expect(auth_credential.refresh_token_expires_at).not_to be_nil }

      context 'nil expires_at' do
        before { auth_credential.update(expires_at: nil) }

        it { expect(auth_credential.refresh_token_expires_at).to be_nil }
      end
    end
  end

  context described_class::CLEVER_DISTRICT_PROVIDER do
    let(:factory) { :clever_district_auth_credential }

    it { expect(auth_credential.refresh_token_expires_at).to eq nil }
    it { expect(auth_credential.refresh_token_valid?).to eq false }

    it { should_be_clever_authorized}
    it { should_not_be_google_authorized }
  end

  context described_class::CLEVER_LIBRARY_PROVIDER do
    let(:factory) { :clever_library_auth_credential }

    it { expect(auth_credential.refresh_token_expires_at).to eq nil }
    it { expect(auth_credential.refresh_token_valid?).to eq false }

    it { should_be_clever_authorized}
    it { should_not_be_google_authorized }
  end

  def should_not_be_google_authorized
    expect(auth_credential.google_authorized?).to be false
  end

  def should_be_clever_authorized
    expect(auth_credential.clever_authorized?).to be true
  end

  def should_not_be_clever_authorized
    expect(auth_credential.clever_authorized?).to be false
  end
end

