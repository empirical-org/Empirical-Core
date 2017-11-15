require 'rails_helper'

describe JoinClassroomWorker, type: :worker do
  let(:worker) { JoinClassroomWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let!(:classroom) { create(:classroom_with_one_student) }
  let(:teacher) { classroom.owner }
  let!(:student) {classroom.students.first}


  it 'sends a segment.io event ' do
    worker.perform(student.id)
    expect(analytics.backend.track_calls.size).to eq(1)
  end
end
