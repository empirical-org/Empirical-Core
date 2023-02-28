# frozen_string_literal: true

require 'rails_helper'

describe IdentifyWorker do
  subject { described_class.new }

  let(:analyzer) { double(:analyzer, track: true) }

  before { allow(Analyzer).to receive(:new) { analyzer } }

  describe '#perform' do
    let!(:user) { create(:user) }

    it 'should call identify on the analytics instance' do
      expect(analyzer).to receive(:identify).with(user)
      subject.perform(user.id)
    end
  end
end
