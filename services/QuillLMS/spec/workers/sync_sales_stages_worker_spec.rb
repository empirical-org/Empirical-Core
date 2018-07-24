require 'rails_helper'

describe SyncSalesStagesWorker, redis: true do
  let(:subject) { described_class.new }

  describe '#perform' do
    let(:sales_contact_serializer) { double(:serializer, account_data: "data") }

    before do
      $redis.lpush("some_key", "id")
      allow(SerializeSalesContact).to receive(:new) { sales_contact_serializer }
      allow(SalesmachineClient).to receive(:batch) { double(:response, blank?: false, success?: true) }
    end

    it 'should seralize the data and batch it in sales machin' do
      expect(SerializeSalesContact).to receive(:new).with("id")
      expect(SalesmachineClient).to receive(:batch).with(["data"])
      subject.perform("some_key")
      expect($redis.lrange("some_key", 0, 99)).to eq []
    end
  end
end