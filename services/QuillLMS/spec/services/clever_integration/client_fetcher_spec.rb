# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::ClientFetcher do
  subject { described_class.run(user) }

  let(:user) { create(:teacher, :signed_up_with_clever) }
  let(:access_token) { auth_credential.access_token }

  context 'no auth_credential' do
    it { expect { subject }.to raise_error CleverIntegration::ClientFetcher::NilAuthCredentialError }
  end

  context 'non-clever auth_credential' do
    let!(:auth_credential) { create(:google_auth_credential, user: user) }

    it { expect { subject }.to raise_error CleverIntegration::ClientFetcher::UnsupportedProviderError }
  end

  context AuthCredential::CLEVER_DISTRICT_PROVIDER do
    let!(:auth_credential) { create(:clever_district_auth_credential, user: user) }

    it do
      expect(CleverIntegration::DistrictClient).to receive(:new).with(access_token)
      subject
    end
  end

  context AuthCredential::CLEVER_LIBRARY_PROVIDER do
    let!(:auth_credential) { create(:clever_library_auth_credential, user: user) }

    it do
      expect(CleverIntegration::LibraryClient).to receive(:new).with(access_token)
      subject
    end
  end
end
