require 'rails_helper'

describe PusherCSVExportCompleted do
  describe '#run' do
    let(:client) { double(:client, trigger: true) }

    before do
      allow(Pusher::Client).to receive(:new) { client }
    end

    it 'should create a pusher client and trigger the event' do
      expect(Pusher::Client).to receive(:new).with(
        app_id: ENV['PUSHER_APP_ID'],
        key: ENV['PUSHER_KEY'],
        secret: ENV['PUSHER_SECRET'],
        encrypted: true
      )
      expect(client).to receive(:trigger).with("1", "csv-export-completed", message: "some_url")
      described_class.run(1, "some_url")
    end
  end
end