require 'spec_helper'

describe StudentCreationWorker, type: :worker do
  let(:worker) { StudentCreationWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let(:student) { FactoryGirl.create(:student) }
  let(:teacher) { FactoryGirl.create(:teacher) }

  it 'sends a segment.io event' do
    worker.perform(teacher.id, student.id)

    expect(analytics.backend.track_calls.size).to eq(1)
    expect(analytics.backend.track_calls[0][:event]).to eq(SegmentIo::Events::STUDENT_ACCOUNT_CREATION_BY_TEACHER)
    expect(analytics.backend.track_calls[0][:user_id]).to eq(teacher.id)
  end
end
