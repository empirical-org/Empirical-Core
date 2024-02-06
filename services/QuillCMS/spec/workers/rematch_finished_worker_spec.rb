require 'json'
require 'rails_helper'
require 'webmock/rspec'

describe RematchFinishedWorker do
  subject { described_class.new }

  describe '#perform' do
    let(:question_key) { 'some_question_key' }

    it 'should trigger the RematchingFinished worker' do
      expect(RematchingFinished).to receive(:run).with(question_key)

      subject.perform(question_key)
    end
  end
end
