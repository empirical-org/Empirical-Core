# frozen_string_literal: true

require 'rails_helper'

describe TeacherDeniedToBecomeAdminAnalyticsWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:teacher) { create(:teacher) }
    let(:analyzer) { double(:analyzer) }

    before { allow(Analyzer).to receive(:new) { analyzer } }

    it 'should track the event' do
      expect(analyzer).to receive(:track).with(teacher, SegmentIo::BackgroundEvents::TEACHER_DENIED_TO_BECOME_ADMIN)
      subject.perform(teacher.id)
    end
  end
end
