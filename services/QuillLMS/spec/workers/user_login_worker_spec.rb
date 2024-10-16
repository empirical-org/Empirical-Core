# frozen_string_literal: true

require 'rails_helper'

describe UserLoginWorker, type: :worker do
  let(:worker) { UserLoginWorker.new }
  let(:analyzer) { double(:analyzerm, track: true, track_with_attributes: true) }
  let(:classroom) { create(:classroom) }
  let(:teacher) { classroom.owner }
  let(:student) { create(:student, classrooms: [classroom]) }

  before { allow(Analytics::Analyzer).to receive(:new) { analyzer } }

  context 'when a teacher logs in' do
    it 'track teacher sign in' do
      expect(analyzer).to receive(:track_with_attributes).with(teacher, Analytics::SegmentIo::BackgroundEvents::TEACHER_SIGNIN, properties: teacher.segment_user.common_params)
      worker.perform(teacher.id)
    end

    it 'creates a UserLogin' do
      allow(analyzer).to receive(:track_with_attributes)

      expect do
        worker.perform(teacher.id)
      end.to change(UserLogin, :count).by(1)
    end
  end

  context 'when student with teacher logs in' do
    it 'track teacher student sign in' do
      expect(analyzer).to receive(:track_with_attributes).with(teacher, Analytics::SegmentIo::BackgroundEvents::TEACHERS_STUDENT_SIGNIN, properties: { student_id: student.id })
      worker.perform(student.id)
    end
  end
end
