require 'rails_helper'

describe UpdateElasticsearchWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let(:response1) { create(:response, id: 1) }
    let(:response2) { create(:response) }
    let(:response3) { create(:response, created_at: Date.yesterday, updated_at: Date.yesterday)}

    before(:all) do
      Sidekiq::ScheduledSet.new.clear
    end

    it 'should spawn UpdateIndividualResponseWorker for today responses and schedule self for next day' do
      Sidekiq::ScheduledSet.new.clear
      expect(UpdateIndividualResponseWorker).to receive(:perform_async).with(response1.id)
      expect(UpdateIndividualResponseWorker).to receive(:perform_async).with(response2.id)
      expect(UpdateIndividualResponseWorker).not_to receive(:perform_async).with(response3.id)
      expect(UpdateElasticsearchWorker).to receive(:perform_at).with(Time.zone.tomorrow.end_of_day - 1.minute, Time.zone.tomorrow.end_of_day - 1.minute)
      subject.perform(Time.zone.today.end_of_day - 1.minute)
    end

    it 'scheduled should return true if the job is already scheduled' do
      subject.perform(Time.zone.today.end_of_day - 1.minute)
      expect(UpdateElasticsearchWorker.new.scheduled?).to equal(true)
      expect(Sidekiq::ScheduledSet.new.entries.count).to eq(1)
    end

    it 'scheduled should schedule a new instance of itself if the job is already scheduled' do
      subject.perform(Time.zone.today.end_of_day - 1.minute)
      expect(UpdateElasticsearchWorker.new.scheduled?).to equal(true)
      expect(Sidekiq::ScheduledSet.new.entries.count).to eq(1)
      subject.perform(Time.zone.today.end_of_day - 1.minute)
    end
  end
end
