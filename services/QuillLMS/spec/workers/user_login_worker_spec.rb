require 'rails_helper'

describe UserLoginWorker, type: :worker do
  let(:worker) { UserLoginWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let(:classroom) { create(:classroom) }
  let(:teacher) { classroom.owner }
  let(:student) { create(:student, classrooms: [classroom]) }


  it 'sends a segment.io event when a teacher logs in' do
    worker.perform(teacher.id, "127.0.0.1")

    expect(analytics.backend.track_calls.size).to eq(1)
    expect(analytics.backend.track_calls[0][:event]).to eq(SegmentIo::Events::TEACHER_SIGNIN)
    expect(analytics.backend.track_calls[0][:user_id]).to eq(teacher.id)
  end

  context 'student with teacher logs in' do
    before :each do
      worker.perform(student.id, "127.0.0.1")
    end

    it 'sends two segment.io event' do
      expect(analytics.backend.track_calls.size).to eq(2)
    end

    it 'sends segment.io event TEACHERS_STUDENT_SIGNIN when a student logs in, identifying the teacher' do
      expect(analytics.backend.track_calls[0][:event]).to eq(SegmentIo::Events::TEACHERS_STUDENT_SIGNIN)
      expect(analytics.backend.track_calls[0][:user_id]).to eq(teacher.id)
    end

    it 'sends segment.io event STUDENT_SIGNIN when a student logs in, identifying the student (AS THE SECOND EVENT)' do
      expect(analytics.backend.track_calls[1][:event]).to eq(SegmentIo::Events::STUDENT_SIGNIN)
      expect(analytics.backend.track_calls[1][:user_id]).to eq(student.id)
    end
  end

  context 'student with no teacher logs in' do
    before :each do
      student.update_attributes(classcode: nil)
      worker.perform(student.id, "127.0.0.1")
    end

    it 'only sends 1 event' do
      expect(analytics.backend.track_calls.size).to eq(2)
    end
  end
end
