# frozen_string_literal: true

require 'rails_helper'

describe PurgeExpiredAuthCredentialWorker do
  subject { described_class.new.perform(auth_credential_id) }

  context 'auth_credential exists' do
    let!(:auth_credential_id) { create(:auth_credential).id }

    it { expect { subject }.to change(AuthCredential, :count).from(1).to(0) }
  end

  context 'auth_credential does not exist' do
    let(:auth_credential_id) { nil }

    it { expect { subject }.not_to change(AuthCredential, :count) }
  end
end


