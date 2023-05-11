# frozen_string_literal: true

require 'rails_helper'

module TeacherNotifications
  describe FanoutSendNotificationsWorker, type: :worker do
    subject { described_class.new }

    let(:activity_session) { create(:activity_session) }

    it 'should perform_async for each worker defined in FANOUT_WORKERS' do
      FanoutSendNotificationsWorker::FANOUT_WORKERS.each do |worker|
        expect(worker).to receive(:perform_async).with(activity_session.id)
      end

      subject.perform(activity_session.id)
    end
  end
end
