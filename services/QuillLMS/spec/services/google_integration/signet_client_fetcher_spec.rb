# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe SignetClientFetcher do
    subject { described_class.run(refresh_token) }

    let(:refresh_token) { 'refresh_token' }
    let(:client_id) { 'client_id' }
    let(:client_secret) { 'client_secret' }

    before do
      stub_const('Auth::Google::CLIENT_ID', client_id)
      stub_const('Auth::Google::CLIENT_SECRET', client_secret)
    end

    it { expect(subject).to be_a(Signet::OAuth2::Client) }
    it { expect(subject.client_id).to eq client_id }
    it { expect(subject.client_secret).to eq client_secret }
    it { expect(subject.refresh_token).to eq refresh_token }

    context 'nil refresh token' do
      let(:refresh_token) { nil }

      it { expect { subject }.to raise_error(SignetClientFetcher::NilRefreshTokenError) }
    end

    context 'scope option provided' do
      subject { described_class.run(refresh_token, **options) }

      let(:scope) { RefreshTokenValidator::MINIMUM_ACCESS_SCOPE }
      let(:options) { { scope: scope } }

      it { expect(subject.scope).to eq scope }
    end
  end
end
