# frozen_string_literal: true

require 'rails_helper'

describe PusherRecommendationCompleted do
  describe '#run' do
    let(:client) { double(:client, trigger: true) }
    let(:classroom) { double(:classroom, id: "some_id", name: "some_name") }

    before do
      allow(Pusher::Client).to receive(:new) { client }
    end

    context 'when lesson is given' do
      it 'should send the unit template assigned event' do
        expect(Pusher::Client).to receive(:new).with(
          app_id: ENV["PUSHER_APP_ID"],
          key: ENV["PUSHER_KEY"],
          secret: ENV["PUSHER_SECRET"],
          encrypted: true
        )
        expect(client).to receive(:trigger).with(
          "some_id",
          "lessons-recommendations-assigned",
          message: "Lessons recommendations assigned to some_name."
        )
        described_class.run(classroom, 1, "some lesson")
      end
    end

    context 'when lesson is not given' do
      it 'should send the personalized recommendations assigned' do
        expect(Pusher::Client).to receive(:new).with(
          app_id: ENV["PUSHER_APP_ID"],
          key: ENV["PUSHER_KEY"],
          secret: ENV["PUSHER_SECRET"],
          encrypted: true
        )
        expect(client).to receive(:trigger).with(
          "some_id",
          "personalized-recommendations-assigned",
          message: "Personalized recommendations assigned to some_name."
        )
        described_class.run(classroom, 1, nil)
      end
    end
  end
end
