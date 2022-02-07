require 'rails_helper'

describe UpdateElasticsearchWorker do
  subject { described_class.new }

  let(:response1) { create(:response, created_at: Time.zone.now.beginning_of_day, updated_at: Time.zone.now.beginning_of_day) }
  let(:response2) { create(:response, created_at: Time.zone.now.beginning_of_day, updated_at: Time.zone.now.beginning_of_day) }
  let(:response3) { create(:response, created_at: Time.zone.now.yesterday, updated_at: Time.zone.now.yesterday)}

  describe '#perform' do
    it 'should kick off jobs on responses' do
      expect(UpdateIndividualResponseWorker).to receive(:perform_async).with(response1.id)
      expect(UpdateIndividualResponseWorker).to receive(:perform_async).with(response2.id)
      expect(UpdateIndividualResponseWorker).not_to receive(:perform_async).with(response3.id)
      subject.perform(Time.zone.now.beginning_of_day.to_s, Time.zone.now.to_s)
    end

    it 'should kick off jobs on responses within time range' do
      expect(UpdateIndividualResponseWorker).not_to receive(:perform_async).with(response1.id)
      expect(UpdateIndividualResponseWorker).not_to receive(:perform_async).with(response2.id)
      expect(UpdateIndividualResponseWorker).to receive(:perform_async).with(response3.id)
      subject.perform(Time.zone.now.yesterday.beginning_of_day.to_s, Time.zone.now.yesterday.end_of_day.to_s)
    end
  end
end
