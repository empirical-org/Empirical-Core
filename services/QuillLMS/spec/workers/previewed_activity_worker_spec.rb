# frozen_string_literal: true

require 'rails_helper'

describe PreviewedActivityWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }
    let!(:activity) { create(:activity) }
    let(:analyzer) { double(:analyzer, track_previewed_activity: true) }

    before do
      allow(SegmentAnalytics).to receive(:new) { analyzer }
    end

    it 'should track the previewed activity if there is a user id' do
      expect(analyzer).to receive(:track_previewed_activity).with(user.id, activity.id)
      subject.perform(user.id, activity.id)
    end

    it 'should not track the previewed activity if there is no user id' do
      expect(analyzer).not_to receive(:track_previewed_activity).with(nil, activity.id)
      subject.perform(nil, activity.id)
    end
  end
end
