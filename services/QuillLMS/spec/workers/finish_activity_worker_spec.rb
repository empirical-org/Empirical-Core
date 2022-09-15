# frozen_string_literal: true

require 'rails_helper'

describe FinishActivityWorker, type: :worker do
  let(:worker) { FinishActivityWorker.new }
  let(:classroom) { create(:classroom) }
  let!(:unit) {create(:unit)}
  let(:classroom_unit) { create(:classroom_unit, classroom: classroom, unit: unit) }
  let(:activity_session) { create(:activity_session,  classroom_unit: classroom_unit) }
  let(:analyzer) { double(:analyzer) }

  before do
    allow(SegmentAnalytics).to receive(:new) { analyzer }
  end

  it 'sends a segment.io event' do
    expect(analyzer).to receive(:track_activity_completion).with(activity_session.classroom_owner, activity_session.user_id, activity_session.activity, activity_session)
    worker.perform(activity_session.uid)
  end
end
