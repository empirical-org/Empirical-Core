require 'rails_helper'

describe UpdateElasticsearchWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let(:response1) { create(:response) }
    let(:response2) { create(:response, id: 2) }
    let(:response3) { create(:response, id: 3, created_at: Date.yesterday, updated_at: Date.yesterday)}
    it 'should spawn UpdateIndividualResponseWorker for today responses and schedule self for next day' do
      expect(UpdateIndividualResponseWorker).to receive(:perform_async).with(response1.id)
      expect(UpdateIndividualResponseWorker).to receive(:perform_async).with(response2.id)
      expect(UpdateIndividualResponseWorker).not_to receive(:perform_async).with(response3.id)
      expect(UpdateElasticsearchWorker).to receive(:perform_at).with(Date.tomorrow.midnight)
      subject.perform
    end
  end
end
