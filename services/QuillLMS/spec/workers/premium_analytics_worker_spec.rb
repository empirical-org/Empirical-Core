require 'rails_helper'

describe PremiumAnalyticsWorker do
  let(:subject) { described_class.new }
  let(:analyzer) { double(:analyzer, track: true) }

  before do
    allow(Analyzer).to receive(:new) { analyzer }
  end

  describe '#perform' do
    let!(:user) { create(:user) }

    context 'when account type is paid' do
      it 'should track began premium' do
        expect(analyzer).to receive(:track).with(user, SegmentIo::BackgroundEvents::BEGAN_PREMIUM)
        subject.perform(user.id, "paid")
      end
    end

    context 'when account type is not paid' do
      it 'should track began trial' do
        expect(analyzer).to receive(:track).with(user, SegmentIo::BackgroundEvents::BEGAN_PREMIUM_TRIAL)
        subject.perform(user.id, "paid")
      end
    end
  end
end
