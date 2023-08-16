# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe AccessTokenRefresher do
    subject { described_class.run(auth_credential) }

    let(:auth_credential) { create(:google_auth_credential) }
    let(:signet_authorization_error) { ::Signet::AuthorizationError.new('error') }

    let(:access_token) { 'access_token' }
    let(:refresh_token) { 'refresh_token' }
    let(:expires_at) { 1.hour.from_now }

    let(:client) do
      double(
        Signet::OAuth2::Client,
        access_token: access_token,
        expires_at: expires_at,
        refresh!: nil,
        refresh_token: refresh_token
      )
    end

    before { allow(SignetClientFetcher).to receive(:run).with(auth_credential.refresh_token).and_return(client) }

    context 'when the refresh token is invalid' do
      before { allow(client).to receive(:refresh!).and_raise(signet_authorization_error) }

      it { expect { subject }.to raise_error(described_class::ClientRefreshError) }

      it 'destroys auth credential if token cannot be refreshed' do
        subject
      rescue described_class::ClientRefreshError
        expect(auth_credential).not_to be_persisted
      end
    end

    context 'when the refresh token is valid' do
      it { expect { subject }.to change { auth_credential.reload.access_token }.to(access_token) }
      it { expect { subject }.to change { auth_credential.reload.expires_at }.to(be_within(1.second).of(expires_at)) }
      it { expect { subject }.to change { auth_credential.reload.refresh_token }.to(refresh_token) }
    end
  end
end
