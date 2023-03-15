# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SaveUserPackSequenceItemsWorker do
  subject { described_class.new.perform(classroom_id, user_id) }

  let(:classroom_id) { create(:classroom).id }
  let(:user_id) { create(:user).id }

  context 'nil classroom_id' do
    let(:classroom_id) { nil }

    it { should_not_run_service_object }
  end

  context 'nil user_id' do
    let(:user_id) { nil }

    it { should_not_run_service_object }
  end

  context 'classroom does not exist' do
    let(:classroom_id) { 0 }

    it { should_not_run_service_object }
  end

  context 'user does not exist' do
    let(:user_id) { 0 }

    it { should_not_run_service_object }
  end

  context 'user and classroom exist' do
    it do
      expect(UserPackSequenceItemSaver).to receive(:run)
      subject
    end
  end

  def should_not_run_service_object
    expect(UserPackSequenceItemSaver).not_to receive(:run)
    subject
  end
end
