require 'rails_helper'

describe UpdateIndividualResponseWorker do
  subject { described_class.new }

  describe '#perform' do
    it 'should call update_index_in_elastic_search' do
      response = double("response", :id => 1)
      allow(Response).to receive(:find) { response }

      expect(Response).to receive(:find).with(response.id)
      expect(response).to receive(:update_index_in_elastic_search)
      subject.perform(response.id)
    end
  end
end
