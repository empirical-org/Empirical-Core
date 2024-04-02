# frozen_string_literal: true

require 'rails_helper'

describe SendPusherMessageWorker do
  subject { described_class.new }

  describe '#perform' do
    let(:user_id) { 1 }
    let(:event_name) { "PusherTestEvent" }
    let(:payload) { "test payload" }
    let(:perform) { subject.perform(user_id, event_name, payload) }

    it do
      expect(PusherTrigger).to receive(:run).with(user_id, event_name, payload)
      perform
    end

    context 'no valid user_id' do
      let(:user_id) { nil }

      it do
        expect(PusherTrigger).not_to receive(:run)
        perform
      end
    end

    context 'no valid event_name' do
      let(:event_name) { nil }

      it do
        expect(PusherTrigger).not_to receive(:run)
        perform
      end
    end

    context 'no specified payload' do
      let(:perform) { subject.perform(user_id, event_name) }

      it do
        expect(PusherTrigger).to receive(:run).with(user_id, event_name, nil)
        perform
      end
    end
  end
end
