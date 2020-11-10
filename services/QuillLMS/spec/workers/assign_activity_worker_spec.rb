require 'rails_helper'

describe AssignActivityWorker, type: :worker do
  let(:worker) { AssignActivityWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let(:teacher) { create(:teacher) }
  let(:unit) { create(:unit) }

  it 'sends a segment.io event' do
    expect(analytics).to receive(:track_activity_pack_assignment).with(teacher.id, unit.id)
    worker.perform(teacher.id, unit.id)
  end
end
