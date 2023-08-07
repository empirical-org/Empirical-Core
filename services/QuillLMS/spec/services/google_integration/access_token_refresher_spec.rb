# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe AccessTokenRefresher do
    subject { described_class.run(auth_credential, authorization_client) }

    let(:auth_credential) { create(:google_auth_credential) }

    let(:authorization_client) do
      instance_double(
        Signet::OAuth2::Client,
        refresh!: nil,
        access_token: access_token,
        refresh_token: refresh_token,
        expires_at: expires_at
      )
    end

    let(:access_token) { 'access_token' }
    let(:refresh_token) { 'refresh_token' }
    let(:expires_at) { 1.hour.from_now }

    it { expect { subject }.to change(auth_credential, :access_token).to(access_token) }
    it { expect { subject }.to change(auth_credential, :refresh_token).to(refresh_token) }
    it { expect { subject }.to change(auth_credential, :expires_at).to(be_within(1.second).of(1.hour.from_now)) }
  end
end
