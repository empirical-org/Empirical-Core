require 'rails_helper'

describe InviteStudentWorker, type: :worker do
  let(:worker) { InviteStudentWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let(:student) { FactoryGirl.create(:student) }
  let(:teacher) { FactoryGirl.create(:teacher) }

  it 'results in the sending of 2 segment.io events' do
    worker.perform(teacher.id, student.id)
    expect(analytics.backend.track_calls.size).to eq(2)
  end
end
