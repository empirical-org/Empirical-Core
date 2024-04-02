# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe RefreshTokenValidator do
    subject { described_class.run(auth_credential) }

    let(:auth_credential) { create(:google_auth_credential) }
    let(:signet_authorization_error) { Signet::AuthorizationError.new('error') }

    let(:client) { double(Signet::OAuth2::Client, fetch_access_token!: nil) }
    let(:options) { { scope: described_class::MINIMUM_ACCESS_SCOPE } }

    before do
      allow(SignetClientFetcher)
        .to receive(:run)
        .with(auth_credential.refresh_token, **options)
        .and_return(client)
    end

    it { expect { subject }.not_to raise_error }

    context 'when the refresh token is invalid' do
      before { allow(client).to receive(:fetch_access_token!).and_raise(signet_authorization_error) }

      it { expect { subject }.to raise_error(described_class::ClientFetchAccessTokenError) }

      it 'destroys auth credential if token cannot be refreshed' do
        subject
      rescue described_class::ClientFetchAccessTokenError
        expect(auth_credential).not_to be_persisted
      end
    end
  end
end
