require 'rails_helper'

describe PusherActivitySessionInteractionLogPosted do
  describe '#run' do
   let(:client) { double(:client, trigger: true) }
   let(:teacher) { create(:teacher) }

    before do
      allow(Pusher::Client).to receive(:new) { client }
    end

    it 'should send the personalized recommendations assigned' do
      expect(Pusher::Client).to receive(:new).with(
        app_id: ENV["PUSHER_APP_ID"],
        key: ENV["PUSHER_KEY"],
        secret: ENV["PUSHER_SECRET"],
        encrypted: true
      )
      expect(client).to receive(:trigger).with(
        teacher.id.to_s,
        'as-interaction-log-pushed',
        message: "Progress is happening."
      )
      described_class.run([teacher.id])
    end
  end
end
