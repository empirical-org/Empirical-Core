require 'rails_helper'

describe SalesContactAnalyticsWorker do
  describe '#perform' do
    let(:tracker) { double(:tracker, track: true) }

    before do
      allow(SalesContactAnalytics).to receive(:new) { tracker }
    end

    it 'should run the sales contact tracker' do
      expect(tracker).to receive(:track)
      subject.perform(1, 2)
    end
  end
end