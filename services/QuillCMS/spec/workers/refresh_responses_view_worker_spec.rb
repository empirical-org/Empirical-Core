require 'rails_helper'

describe RefreshResponsesViewWorker do
  let(:worker) { described_class.new }

  describe '#perform' do
    it 'should call refresh for GradedResponse' do

      expect(GradedResponse).to receive(:refresh)

      worker.perform("GradedResponse")
    end

    it 'should call refresh for MultipleChoiceResponse' do

      expect(MultipleChoiceResponse).to receive(:refresh)

      worker.perform("MultipleChoiceResponse")
    end

    it 'should raise on an invalid view' do
      expect {worker.perform("Not a class")}.to raise_error(RefreshResponsesViewWorker::InvalidView)
    end
  end
end
