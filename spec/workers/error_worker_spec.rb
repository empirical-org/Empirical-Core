require 'rails_helper'

describe ErrorWorker, type: :worker do

  let!(:analytics) { SegmentAnalytics.new }

  it 'sends a segment.io event' do
    ErrorWorker.new.perform
    expect(analytics.backend.track_calls.size).to eq(1)
  end
end