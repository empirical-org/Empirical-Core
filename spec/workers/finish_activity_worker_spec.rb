require 'spec_helper'

describe FinishActivityWorker, type: :worker do
  let(:worker) { FinishActivityWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let(:classroom) { FactoryGirl.create(:classroom) }
  let(:classroom_activity) { FactoryGirl.create(:classroom_activity, classroom: classroom, unit: classroom.units.first) }
  let(:activity_session) { FactoryGirl.create(:activity_session, state: 'finished', classroom_activity: classroom_activity) }

  it 'sends a segment.io event' do
    worker.perform(activity_session.uid)

    expect(analytics.backend.track_calls.size).to eq(1)
    expect(analytics.backend.track_calls[0][:event]).to eq(SegmentIo::Events::ACTIVITY_COMPLETION)
  end
end