require 'rails_helper'

describe SalesmachineClient do
  let(:subject) { described_class.new }
  let(:fake_sales_machine) { double(:sales_machine, batch: "batch", event: "event") }

  describe 'batch' do
    before do
      allow(described_class).to receive(:new) { fake_sales_machine }
    end

    it 'should call batch on a new machine' do
      expect(described_class.batch("data")).to eq "batch"
    end
  end

  describe 'event' do
    before do
      allow(described_class).to receive(:new) { fake_sales_machine }
    end

    it 'should call event on a new machine' do
      expect(described_class.event("data")).to eq "event"
    end
  end

  describe '#auth_header_value' do
    before do
      allow(Base64).to receive(:encode64) { |value| value }
    end

    it 'should return the base encoded api key' do
      expect(subject.auth_header_value).to eq "Basic #{ENV['SALESMACHINE_API_KEY'] + ":"}"
    end
  end

  describe '#client' do
    it 'should return the faraday client with the correct url' do
      expect(subject.client.class).to eq Faraday::Connection
      expect(subject.client.url_prefix.to_s).to eq "https://api.salesmachine.io/"
    end
  end

  describe '#batch' do
    it 'should make the request with the batch endpoint' do
      expect(subject).to receive(:make_request).with(SalesmachineClient::BATCH_ENDPOINT, "data")
      subject.batch("data")
    end
  end
  
  describe '#event' do
    it 'should make the request with the batch endpoint' do
      expect(subject).to receive(:make_request).with(SalesmachineClient::EVENT_ENDPOINT, "data")
      subject.event("data")
    end
  end
end