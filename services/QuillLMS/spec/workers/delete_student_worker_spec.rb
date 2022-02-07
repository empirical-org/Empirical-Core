# frozen_string_literal: true

require 'rails_helper'

describe DeleteStudentWorker do
  subject { described_class.new }

  let(:analyzer) { double(:analyzer, track: true) }

  before do
    allow(Analyzer).to receive(:new) { analyzer }
  end

  describe '#perform' do
    let!(:teacher) { create(:teacher) }

    context 'if referred from class path' do
      it 'should track the delete student account' do
        expect(analyzer).to receive(:track).with(teacher, SegmentIo::BackgroundEvents::TEACHER_DELETED_STUDENT_ACCOUNT)
        subject.perform(teacher.id, true)
      end
    end

    context 'if not referred from class path' do
      it 'should track the mystery delete student' do
        expect(analyzer).to receive(:track).with(teacher, SegmentIo::BackgroundEvents::MYSTERY_STUDENT_DELETION)
        subject.perform(teacher.id, false)
      end
    end
  end
end
