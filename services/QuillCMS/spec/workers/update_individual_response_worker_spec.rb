require 'rails_helper'

describe UpdateIndividualResponseWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let(:response) { create(:response) }
    it 'should call update_index_in_elastic_search' do
      expect(response).to receive(:update_index_in_elastic_search)
      response.update_index_in_elastic_search
    end
  end
end
