require 'rails_helper'

describe SalesContactUpdaterWorker do
  describe '#perform' do
    let(:updater) {double(:updater, update: true) }

    before do
      allow(SalesContactUpdater).to receive(:new) { updater }
    end

    it 'should run the sales contact updater' do
      expect(updater).to receive(:update)
      subject.perform(1, 2)
    end
  end
end