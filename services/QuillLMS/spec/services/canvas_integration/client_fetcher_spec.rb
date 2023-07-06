# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasIntegration::ClientFetcher do
  subject { described_class.run(user) }

  let(:user) { create(:teacher, :with_canvas_account) }

  context 'no canvas_auth_credential' do
    it { expect { subject }.to raise_error CanvasIntegration::ClientFetcher::NilCanvasAuthCredentialError }
  end

  context 'with canvas_auth_credential, but no canvas_instance_auth_credential' do
    before { create(:canvas_auth_credential_without_canvas_instance_auth_credential, user: user) }

    it { expect { subject }.to raise_error CanvasIntegration::ClientFetcher::NilCanvasInstanceError }
  end

  context 'with canvas_auth_credential and canvas_instance_auth_credential' do
    let!(:canvas_auth_credential) { create(:canvas_auth_credential, user: user) }

    it { expect(subject).to be_a CanvasIntegration::RestClient }

    it do
      expect(CanvasIntegration::RestClient).to receive(:new).with(canvas_auth_credential)
      subject
    end
  end
end
