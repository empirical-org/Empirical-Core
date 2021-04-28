require 'rails_helper'

describe PopulateAllActivityHealthsWorker do
  let(:subject) { described_class.new }

  describe '#perform' do

    it 'should track began teacher premium' do
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
      activity_health = ActivityHealth.create
      expect(ActivityHealth.count).to eq(1)
      activity = create(:activity)
      activity_two = create(:activity)
      activity_three = create(:activity)

      subject.perform
      expect(ActivityHealth.count).to eq(0)
      expect(ActivityHealth.create.id).to eq(1)
    end
  end
end
