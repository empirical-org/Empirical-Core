require 'rails_helper'

describe ClickSignUpWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let(:analyzer) { double(:analyzer, track_click_sign_up: true) }

    before do
      allow(SegmentAnalytics).to receive(:new) { analyzer }
    end

    it 'should track the sign up click' do
      expect(analyzer).to receive(:track_click_sign_up)
      subject.perform
    end
  end
end