# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  describe AuthorizationClientFetcher do
    subject { described_class.run(auth_credential) }

    let(:auth_credential) { create(:google_auth_credential, expires_at: expires_at) }
    let(:client) { double(Signet::OAuth2::Client, refresh!: nil) }
    let(:client_id) { 'client_id' }
    let(:client_secret) { 'client_secret' }

    let(:client_args) do
      {
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: auth_credential.refresh_token,
        token_credential_uri: described_class::TOKEN_CREDENTIAL_URI
      }
    end

    before {
      stub_const('Auth::Google::CLIENT_ID', client_id)
      stub_const('Auth::Google::CLIENT_SECRET', client_secret)
      allow(Signet::OAuth2::Client).to receive(:new).with(**client_args).and_return(client)
    }

    context 'when the access token is expired' do
      let(:expires_at) { GoogleAuthCredential::EXPIRATION_DURATION.ago }

      before { allow(AccessTokenRefresher).to receive(:run).with(auth_credential, client) }

      it do
        expect(AccessTokenRefresher).to receive(:run).with(auth_credential, client)
        subject
      end
    end

    context 'when the access token is not expired' do
      let(:expires_at) { 1.day.from_now }

      it { is_expected.to eq client }

      it do
        expect(AccessTokenRefresher).not_to receive(:run)
        subject
      end
    end
  end
end
