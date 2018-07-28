require 'rails_helper'

describe SyncSalesContactWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let(:syncer) { double(:syncer, sync: true) }

    before do
      allow(SalesContactSyncer).to receive(:new) { syncer }
    end

    it 'should sync the sales contact syncer' do
      expect(SalesContactSyncer).to receive(:new).with(1)
      expect(syncer).to receive(:sync)
      subject.perform(1)
    end
  end
end
