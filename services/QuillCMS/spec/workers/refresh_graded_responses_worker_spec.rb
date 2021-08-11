require 'rails_helper'

describe RefreshGradedResponsesWorker do
  let(:worker) { described_class.new }

  describe '#perform' do
    it 'should call refresh' do

      expect(GradedResponse).to receive(:refresh)

      worker.perform
    end
  end
end
