require 'rails_helper'

describe JoinClassroomWorker, type: :worker do
  let(:worker) { JoinClassroomWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let(:teacher) { FactoryGirl.create(:teacher) }
  let(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let(:student) { FactoryGirl.create(:student, classroom: classroom) }

  it 'sends a segment.io event ' do
    worker.perform(student.id)
    expect(analytics.backend.track_calls.size).to eq(1)
  end
end
