# frozen_string_literal: true

require 'rails_helper'

describe CheckboxAnalyticsWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }
    let!(:activity) { create(:activity) }
    let(:analyzer) { double(:analyzer) }

    before do
      allow(SegmentAnalytics).to receive(:new) { analyzer }
    end

    it 'should track the event' do
      expect(analyzer).to receive(:track_activity_assignment).with(user.id, activity.id)
      subject.perform(user.id, activity.id)
    end
  end
end
