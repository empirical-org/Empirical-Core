require 'spec_helper'

describe UserLoginWorker, type: :worker do
  let(:worker) { UserLoginWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let(:student) { FactoryGirl.create(:student) }
  let(:teacher) { FactoryGirl.create(:teacher) }

  it 'sends a segment.io event when a teacher logs in' do
    worker.perform(teacher.id, "127.0.0.1")

    expect(analytics.backend.track_calls.size).to eq(1)
    expect(analytics.backend.track_calls[0][:event]).to eq(SegmentIo::Events::TEACHER_SIGNIN)
    expect(analytics.backend.track_calls[0][:user_id]).to eq(teacher.id)
  end

  it 'does not send a segment.io event when a student logs in' do
    worker.perform(student.id, "127.0.0.1")
    expect(analytics.backend.track_calls.size).to eq(0)
  end
end