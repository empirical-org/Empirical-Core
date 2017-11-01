require 'rails_helper'

describe JoinClassroomWorker, type: :worker do
  let(:worker) { AccessProgressReportWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let(:teacher) { FactoryBot.create(:teacher) }
  let(:classroom) { FactoryBot.create(:classroom, teacher: teacher) }


  it 'sends a segment.io event ' do
    worker.perform(teacher.id)
    expect(analytics.backend.track_calls.size).to eq(1)
  end
end
