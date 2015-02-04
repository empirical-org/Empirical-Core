require 'spec_helper'

describe AssignActivityWorker, type: :worker do
  let(:worker) { AssignActivityWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let(:teacher) { FactoryGirl.create(:teacher) }

  it 'sends a segment.io event' do
    worker.perform(teacher.id)

    expect(analytics.backend.track_calls.size).to eq(1)
    expect(analytics.backend.track_calls[0][:event]).to eq(SegmentIo::Events::ACTIVITY_ASSIGNMENT)
    expect(analytics.backend.track_calls[0][:user_id]).to eq(teacher.id)
  end
end