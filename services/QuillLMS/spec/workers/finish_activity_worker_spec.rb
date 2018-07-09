require 'rails_helper'

describe FinishActivityWorker, type: :worker do
  let(:worker) { FinishActivityWorker.new }
  let(:classroom) { create(:classroom) }
  let!(:unit) {create(:unit)}
  let(:classroom_activity) { create(:classroom_activity, classroom: classroom, unit: unit) }
  let(:activity_session) { create(:activity_session,  classroom_activity: classroom_activity) }
  let(:analyzer) { double(:analyzer) }

  before do
    allow(Analyzer).to receive(:new) { analyzer }
  end

  it 'sends a segment.io event' do
    expect(analyzer).to receive(:track).with(activity_session.classroom_owner, SegmentIo::Events::ACTIVITY_COMPLETION)
    worker.perform(activity_session.uid)
  end
end
