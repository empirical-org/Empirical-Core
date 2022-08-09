# frozen_string_literal: true

require 'rails_helper'

describe UserLoginWorker, type: :worker do
  let(:worker) { UserLoginWorker.new }
  let(:analyzer) { double(:analyzerm ,track: true, track_with_attributes: true) }
  let(:classroom) { create(:classroom) }
  let(:teacher) { classroom.owner }
  let(:student) { create(:student, classrooms: [classroom]) }

  before { allow(Analyzer).to receive(:new) { analyzer } }

  context 'when a teacher logs in' do
    it 'track teacher sign in' do
      expect(analyzer).to receive(:track_with_attributes).with(teacher, SegmentIo::BackgroundEvents::TEACHER_SIGNIN, properties: teacher.segment_integration.common_params)
      worker.perform(teacher.id)
    end
  end

  context 'when student with teacher logs in' do
    it 'track teacher student sign in' do
      expect(analyzer).to receive(:track_with_attributes).with(teacher, SegmentIo::BackgroundEvents::TEACHERS_STUDENT_SIGNIN, properties: {student_id: student.id})
      worker.perform(student.id)
    end
  end
end
