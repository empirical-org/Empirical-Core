# frozen_string_literal: true

require 'rails_helper'

RSpec.describe VitallyIntegration::UnlinkUserWorker do
  subject { described_class.new.perform(user_id, school_id) }

  context 'valid user_id' do
    let(:user_id) { '123' }

    context 'valid school_id' do
      let(:school_id) { '456' }
      let(:uuid) { 'abcdefg' }
      let(:payload) { { userId: user_id, accountId: school_id, messageId: uuid } }

      before { allow(SecureRandom).to receive(:uuid).and_return(uuid) }

      it 'should unlink the user from vitally' do
        api = double(:vitally_api)
        expect(VitallyApi).to receive(:new).and_return(api)
        expect(api).to receive(:unlink).with(payload)
        subject
      end
    end

    context 'invalid school_id' do
      let(:school_id) { nil }

      it { should_not_unlink_user }
    end
  end

  context 'invalid user_id' do
    let(:user_id) { nil }

    context 'valid school_id' do
      let(:school_id) { '456' }

      it { should_not_unlink_user }
    end

    context 'invalid school_id' do
      let(:school_id) { nil }

      it { should_not_unlink_user }
    end
  end

  def should_not_unlink_user
    expect(VitallyApi).not_to receive(:new)
    subject
  end
end


