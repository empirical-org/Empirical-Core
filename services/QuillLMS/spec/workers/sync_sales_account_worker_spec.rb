require 'rails_helper'

describe SyncSalesAccountWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let(:syncer) { double(:syncer, sync: true) }

    before do
      allow(SyncSalesAccount).to receive(:new) { syncer }
    end

    it 'should sync the account worker' do
      expect(SyncSalesAccount).to receive(:new).with(1)
      expect(syncer).to receive(:sync)
      subject.perform(1)
    end
  end
end
