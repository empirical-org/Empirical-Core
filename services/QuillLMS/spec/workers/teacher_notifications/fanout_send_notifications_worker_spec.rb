# frozen_string_literal: true

require 'rails_helper'

module TeacherNotifications
  describe FanoutSendNotificationsWorker, type: :worker do
    subject { described_class.new }

    let(:activity_session) { create(:activity_session) }

    it 'should perform_async for each worker defined in FANOUT_WORKERS' do
      expect(FanoutSendNotificationsWorker::FANOUT_WORKERS).to all(receive(:perform_async).with(activity_session.id))

      subject.perform(activity_session.id)
    end
  end
end
