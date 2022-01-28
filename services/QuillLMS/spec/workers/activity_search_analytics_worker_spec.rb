# frozen_string_literal: true

require 'rails_helper'

describe ActivitySearchAnalyticsWorker do
  subject { described_class.new }

  describe '#perform' do
    let(:analytics) { double(:analytics) }
    let!(:user) { create(:user) }

    before do
      allow(SegmentAnalytics).to receive(:new) { analytics }
    end

    it 'should track the activity search' do
      expect(analytics).to receive(:track_activity_search).with(user.id, "query")
      subject.perform(user.id, "query")
    end
  end
end
