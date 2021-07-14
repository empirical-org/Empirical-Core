require 'rails_helper'

describe AuthCredential, type: :model do
  it { should belong_to(:user) }

  let(:auth_credential) { create(:auth_credential, provider: 'google') }

  context '#google_authorized?' do
    context 'non google provider' do
      before { auth_credential.update(provider: 'hooli') }

      it { should_be_unauthorized_for_google }
    end

    context 'nil expires_at' do
      before { auth_credential.update(expires_at: nil) }

      it { should_be_unauthorized_for_google }
    end

    context 'nil refresh token' do
      before { auth_credential.update(refresh_token: nil) }

      it { should_be_unauthorized_for_google }
    end

    context 'expired refresh token' do
      let(:expires_at) { Time.now - AuthCredential::EXPIRATION_DURATION - 1.month }

      before { auth_credential.update(expires_at: expires_at) }

      it { should_be_unauthorized_for_google }
    end

    def should_be_unauthorized_for_google
      expect(auth_credential.google_authorized?).to be false
    end
  end
end