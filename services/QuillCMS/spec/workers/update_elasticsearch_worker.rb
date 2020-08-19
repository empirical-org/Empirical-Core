require 'rails_helper'

describe UpdateElasticsearchWorker do
  let(:subject) { described_class.new }
  let(:response1) { create(:response, id: 1) }
  let(:response2) { create(:response) }
  let(:response3) { create(:response, created_at: Date.yesterday, updated_at: Date.yesterday)}

  describe '#perform' do
    it 'should kick off jobs on responses' do
      expect(UpdateIndividualResponseWorker).to receive(:perform_async).with(response1.id)
      expect(UpdateIndividualResponseWorker).to receive(:perform).with(response2.id)
      expect(UpdateIndividualResponseWorker).not_to receive(:perform).with(response3.id)
      subject.perform(Time.now)
    end
  end
end
