require 'rails_helper'

describe PopulateAllActivityHealthsWorker do
  let(:subject) { described_class.new }

  describe '#perform' do

    it 'should track began teacher premium' do
      activity = create(:activity, flags: ["production"])
      activity_two = create(:activity, flags: ["production"])
      activity_three = create(:activity, flags: ["production"])
      expect(PopulateActivityHealthWorker).to receive(:perform_async).with(activity.id)
      expect(PopulateActivityHealthWorker).to receive(:perform_async).with(activity_two.id)
      expect(PopulateActivityHealthWorker).to receive(:perform_async).with(activity_three.id)
      subject.perform
    end
  end
end
