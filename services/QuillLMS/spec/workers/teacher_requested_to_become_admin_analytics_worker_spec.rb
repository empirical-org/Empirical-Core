# frozen_string_literal: true

require 'rails_helper'

describe TeacherRequestedToBecomeAdminAnalyticsWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:teacher) { create(:teacher) }
    let(:analyzer) { double(:analyzer) }

    before { allow(Analyzer).to receive(:new) { analyzer } }

    it 'should track the new user event if new user is true' do
      expect(analyzer).to receive(:track).with(teacher, SegmentIo::BackgroundEvents::NEW_USER_REQUESTED_TO_BECOME_ADMIN)
      subject.perform(teacher.id, true)
    end

    it 'should track the teacher event if new user is false' do
      expect(analyzer).to receive(:track).with(teacher, SegmentIo::BackgroundEvents::TEACHER_REQUESTED_TO_BECOME_ADMIN)
      subject.perform(teacher.id, false)
    end
  end
end
