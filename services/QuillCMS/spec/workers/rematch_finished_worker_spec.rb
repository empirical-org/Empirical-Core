require 'json'
require 'rails_helper'
require 'webmock/rspec'

describe RematchFinishedWorker do
  describe '#perform' do
    let(:question_key) { 'some_question_key' }

    it 'should trigger the RematchingFinished worker' do
      expect(RematchingFinished).to receive(:run).with(question_key)

      described_class.new.perform(question_key)
    end
  end
end
