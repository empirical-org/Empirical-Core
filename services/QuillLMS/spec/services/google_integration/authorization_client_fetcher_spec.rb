# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  describe AuthorizationClientFetcher do
    subject { described_class.run(auth_credential) }

    let(:auth_credential) { create(:google_auth_credential, refresh_token: original_refresh_token) }
    let(:original_refresh_token) { 'original_refresh_token' }
    let(:new_auth_credential) { double(GoogleAuthCredential, refresh_token: updated_refresh_token) }
    let(:updated_refresh_token) { 'updated_refresh_token' }

    context 'validate refresh token fails' do
      let(:error) { RefreshTokenValidator::ClientFetchAccessTokenError.new('error') }

      before do
        allow(RefreshTokenValidator)
          .to receive(:run)
          .with(auth_credential)
          .and_raise(error)
      end

      it { expect { subject }.to raise_error(error) }
    end

    context 'validate refresh token succeeds' do
      before { allow(RefreshTokenValidator).to receive(:run).with(auth_credential) }

      it { expect(subject).to be_a(Signet::OAuth2::Client)}

      it do
        expect(SignetClientFetcher).to receive(:run).with(original_refresh_token)
        subject
      end

      context 'access token is expired' do
        before { allow(auth_credential).to receive(:access_token_expired?).and_return(true) }

        context 'refresh access token succeeds' do
          before do
            allow(AccessTokenRefresher).to receive(:run).with(auth_credential).and_return(true)
            allow(auth_credential).to receive(:reload).and_return(new_auth_credential)
          end

          it { expect(subject).to be_a(Signet::OAuth2::Client) }

          it do
            expect(SignetClientFetcher).to receive(:run).with(updated_refresh_token)
            subject
          end
        end

        context 'refresh access token fails' do
          let(:error) { AccessTokenRefresher::ClientRefreshError.new('error') }

          before do
            allow(AccessTokenRefresher)
              .to receive(:run)
              .with(auth_credential)
              .and_raise(error)
          end

          it { expect { subject }.to raise_error(error) }
        end
      end
    end
  end
end
