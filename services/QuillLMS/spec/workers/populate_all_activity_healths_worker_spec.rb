# frozen_string_literal: true

require 'rails_helper'

RSpec::Matchers.define :a_multiple_of do |x|
  match { |actual| (actual % x).zero? }
end

describe PopulateAllActivityHealthsWorker do
  subject { described_class.new }

  let(:connect) { create(:activity_classification, key: "connect") }
  let(:activity) { create(:activity, activity_classification_id: connect.id) }
  let(:activity_two) { create(:activity, activity_classification_id: connect.id) }
  let(:activity_three) { create(:activity, activity_classification_id: connect.id) }
  let(:activity_archived) { create(:activity, activity_classification_id: connect.id, flags: '{archived}') }

  describe '#perform' do

    it 'should kick off populate activity health worker jobs spread out by interval' do
      stub_const("PopulateAllActivityHealthsWorker::INTERVAL", 5)

      expect(PopulateActivityHealthWorker).to receive(:perform_in).with(a_multiple_of(5), activity.id)
      expect(PopulateActivityHealthWorker).to receive(:perform_in).with(a_multiple_of(5), activity_two.id)
      expect(PopulateActivityHealthWorker).to receive(:perform_in).with(a_multiple_of(5), activity_three.id)
      subject.perform
    end

    it 'should not run for archived activity' do
      stub_const("PopulateAllActivityHealthsWorker::INTERVAL", 5)

      expect(PopulateActivityHealthWorker).to receive(:perform_in).with(0, activity.id).once
      expect(PopulateActivityHealthWorker).to_not receive(:perform_in).with(5, activity_archived.id)

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
