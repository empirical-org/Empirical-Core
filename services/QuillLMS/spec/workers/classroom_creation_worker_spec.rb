# frozen_string_literal: true

require 'rails_helper'

describe ClassroomCreationWorker, type: :worker do
  let(:worker) { ClassroomCreationWorker.new }
  let(:analytics) { SegmentAnalytics.new }
  let(:classroom) { create(:classroom) }

  it 'sends a segment.io event' do
    worker.perform(classroom.id)

    expect(analytics.backend.track_calls.size).to eq(2)
    expect(analytics.backend.track_calls[0][:event]).to eq("#{SegmentIo::BackgroundEvents::CLASSROOM_CREATION} | Manual")
    expect(analytics.backend.track_calls[1][:event]).to eq(SegmentIo::BackgroundEvents::CLASSROOM_CREATION)
  end
end
