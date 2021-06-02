require 'rails_helper'

describe PopulateAllActivityHealthsWorker do
  let(:subject) { described_class.new }

  describe '#perform' do

    it 'should kick off populate activity health worker jobs' do
      connect = create(:activity_classification, key: "connect")
      activity = create(:activity, activity_classification_id: connect.id)
      activity_two = create(:activity, activity_classification_id: connect.id)
      activity_three = create(:activity, activity_classification_id: connect.id)
      expect(PopulateActivityHealthWorker).to receive(:perform_async).with(activity.id)
      expect(PopulateActivityHealthWorker).to receive(:perform_async).with(activity_two.id)
      expect(PopulateActivityHealthWorker).to receive(:perform_async).with(activity_three.id)
      subject.perform
    end

    it 'should truncate the table each time the job is run' do
      ActivityHealth.create
      expect(ActivityHealth.count).to eq(1)
      create_list(:activity, 3)

      subject.perform
      expect(ActivityHealth.count).to eq(0)
      expect(ActivityHealth.create.id).to eq(1)
    end
  end
end
