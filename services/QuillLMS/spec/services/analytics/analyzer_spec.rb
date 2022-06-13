# frozen_string_literal: true

require 'rails_helper'

describe Analyzer do
  let(:analyzer) { double(:analyzer, track: true, identify: true) }
  let(:user) { double(:user, id: "some_id", ip_address: "some_ip") }

  subject { described_class.new(analyzer) }

  describe '#track' do
    it 'should identify the user and track the correct attributes' do
      expect(analyzer).to receive(:identify).with(user)
      expect(analyzer).to receive(:track).with({
        user_id: user.id,
        event: "event",
        context: { ip: user.ip_address }
      })
      subject.track(user, "event")
    end
  end

  describe '#track_with_attributes' do
    it 'should identify the user and track the attributes given' do
      expect(analyzer).to receive(:identify).with(user)
      expect(analyzer).to receive(:track).with({
          user_id: user.id,
          event: "event",
          key: "value"
      })
      subject.track_with_attributes(user, "event", { key: "value" })
    end
  end

  describe '#track_chain' do
    it 'should identify the user and track all the events given with the correct attributes' do
      expect(analyzer).to receive(:identify).with(user)
      expect(analyzer).to receive(:track).with({
          user_id: user.id,
          event: "event",
          context: { ip: user.ip_address }
      })
      expect(analyzer).to receive(:track).with({
          user_id: user.id,
          event: "another_event",
          context: { ip: user.ip_address }
      })
      subject.track_chain(user, %w{event another_event})
    end
  end
end
