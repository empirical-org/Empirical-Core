# frozen_string_literal: true

require 'rails_helper'

describe GetActivitiesQuery do
  describe '#run' do
    let(:activity) { create(:activity) }
    let(:activity_category) { create(:activity_category) }
    let!(:activity_category_activity) { create(:activity_category_activity, activity: activity, activity_category: activity_category) }

    subject { described_class.new(activity_category.id) }

    it 'should get the activity id and name and activity category activity order number' do
      expect(subject.run.first).to eq(activity)
    end
  end
end
