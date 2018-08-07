require 'rails_helper'

describe CheckboxAnalyticsWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }
    let(:analyzer) { double(:analyzer) }

    before do
      allow(SegmentAnalytics).to receive(:new) { analyzer }
    end

    it 'should track the event' do
      expect(analyzer).to receive(:track_event_from_string).with("BUILD_YOUR_OWN_ACTIVITY_PACK", user.id)
      subject.perform(user.id, "Build Your Own Activity Pack")
    end
  end
end