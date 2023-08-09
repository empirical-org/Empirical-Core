# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe ClientFetcher do
    subject { described_class.run(user) }

    let(:user) { create(:teacher) }

    it { expect { subject }.to raise_error described_class::NilAuthCredentialError }

    context 'with non google-auth credential' do
      before { create(:clever_library_auth_credential, user: user) }

      it { expect { subject }.to raise_error described_class::NonGoogleAuthCredentialError }
    end

    context 'with google_auth_credential' do
      let!(:auth_credential) { create(:google_auth_credential, user: user) }

      it do
        expect(RestClient).to receive(:new).with(auth_credential)
        subject
      end

      context 'not google_authorized' do
        before { allow(auth_credential).to receive(:google_authorized?).and_return(false) }

        it { expect { subject }.to raise_error described_class::GoogleUnauthorizedError }
      end
    end
  end
end
