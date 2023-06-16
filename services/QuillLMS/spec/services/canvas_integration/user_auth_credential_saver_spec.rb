# frozen_string_literal: true

require 'rails_helper'

describe CanvasIntegration::UserAuthCredentialSaver do
  subject { described_class.run(auth_hash) }

  let(:auth_hash) { create(:canvas_auth_hash, url: url) }
  let(:url) { canvas_instance.url }
  let(:canvas_instance) { create(:canvas_instance) }
  let(:external_id) { auth_hash[:uid] }
  let(:canvas_account) { create(:canvas_account, canvas_instance: canvas_instance, external_id: external_id) }

  context 'canvas_account exists with canvas_instance, external_id' do
    let(:user) { canvas_account.user }

    before { canvas_account }

    it { expect(subject).to eq user }
    it { expect { subject }.to change(AuthCredential, :count).by(1) }
  end

  context 'auth_hash contains invalid canvas_instance_url' do
    let(:url) { Faker::Internet.url }

    it { expect { subject }.to raise_error described_class::CanvasInstanceNotFoundError }
  end

  context 'canvas_account does not exist with canvas_instance, external_id' do
    it { expect { subject }.to raise_error described_class::CanvasAccountNotFoundError }
  end
end
