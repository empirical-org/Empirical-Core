require 'rails_helper'

describe JoinClassroomWorker, type: :worker do
  let(:worker) { JoinClassroomWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let(:teacher) { FactoryBot.create(:teacher) }
  let(:classroom) { FactoryBot.create(:classroom, teacher: teacher) }
  let(:student) { FactoryBot.create(:student, classrooms: [classroom]) }


  it 'sends a segment.io event ' do
    worker.perform(student.id)
    expect(analytics.backend.track_calls.size).to eq(1)
  end
end