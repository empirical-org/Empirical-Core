require 'rails_helper'

describe UserLoginWorker, type: :worker do
  let(:worker) { UserLoginWorker.new }
  let(:analyzer) { double(:analyzerm ,track: true, track_with_attributes: true) }
  let(:classroom) { create(:classroom) }
  let(:teacher) { classroom.owner }
  let(:student) { create(:student, classrooms: [classroom]) }

  before do
    allow(Analyzer).to receive(:new) { analyzer }
  end

  context 'when a teacher logs in' do
    it 'track teacher sign in' do
      expect(analyzer).to receive(:track).with(teacher, SegmentIo::Events::TEACHER_SIGNIN)
      worker.perform(teacher.id, "127.0.0.1")
    end
  end

  context 'when student with teacher logs in' do

    it 'track teacher student sign in and student sign in' do
      expect(analyzer).to receive(:track).with(teacher, SegmentIo::Events::TEACHERS_STUDENT_SIGNIN)
      worker.perform(student.id, "127.0.0.1")
      expect(analyzer).to have_received(:track_with_attributes).with(
          student.reload,
          SegmentIo::Events::STUDENT_SIGNIN,
          {
              context: { :ip => student.reload.ip_address },
              integrations: { all: true, Intercom: false }
          }
      )
    end
  end

  context 'student with no teacher logs in' do
    before :each do
      allow(StudentsTeacher).to receive(:run) { nil }
    end

    it 'should track student signin' do
      expect(analyzer).to_not receive(:track)
      worker.perform(student.id, "127.0.0.1")
      expect(analyzer).to have_received(:track_with_attributes).with(
          student.reload,
          SegmentIo::Events::STUDENT_SIGNIN,
          {
              context: { :ip => student.reload.ip_address },
              integrations: { all: true, Intercom: false }
          }
      )
    end
  end
end
