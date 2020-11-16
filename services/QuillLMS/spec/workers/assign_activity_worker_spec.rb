require 'rails_helper'

describe AssignActivityWorker, type: :worker do
  let(:worker) { AssignActivityWorker.new }
  let(:analytics) { double(:analytics, identify: true, track: true) }
  let(:teacher) { create(:teacher) }
  let(:unit) { create(:unit) }

  before do
    allow(SegmentAnalytics).to receive(:new) { analytics }
  end

  it 'sends a segment.io event' do
    expect(analytics).to receive(:track_activity_pack_assignment).with(teacher.id, unit.id)
    worker.perform(teacher.id, unit.id)
  end
end
