# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ExpirePasswordTokenWorker do
  subject { described_class.new.perform(user_id) }

  let(:user_id) { nil }

  context 'when user_id is nil' do
    it { expect { subject }.not_to raise_error }
  end

  context 'when user is not present' do
    let(:user_id) { 1 }

    it do
      expect(ErrorNotifier).to receive(:report).with(described_class::UserNotFoundError, user_id: user_id)
      subject
    end
  end

  context 'when user is present' do
    let(:user) { create(:user) }
    let(:user_id) { user.id }

    before { user.refresh_token! }

    it { expect { subject }.to change { user.reload.token }.to(nil) }
  end
end

