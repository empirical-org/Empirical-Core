require 'spec_helper'

describe FinishActivityWorker, type: :worker do
  let(:worker) { FinishActivityWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let(:activity_session) { FactoryGirl.create(:activity_session, state: 'finished') }

  it 'sends a segment.io event' do
    worker.perform(activity_session.uid)

    expect(analytics.backend.track_calls.size).to eq(1)
    expect(analytics.backend.track_calls[0][:event]).to eq(SegmentIo::Events::ACTIVITY_COMPLETION)
  end
end