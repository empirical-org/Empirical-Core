# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SegmentIntegration::Activity do
  let(:activity_category) { create(:activity_category) }
  let(:activity_classification) { create(:activity_classification) }
  let(:activity) { create(:activity, activity_classification_id: activity_classification.id, activity_categories: [activity_category]) }
  let(:activity_category_activity) { create(:activity_category_activity, activity: activity, activity_category: activity_category) }

  context '#common_params' do

    it 'returns the expected params hash' do
      params = {
        activity_name: activity.name,
        tool_name: activity.classification.name.split[1]
      }.reject {|_,v| v.nil? }
      expect(activity.segment_activity.common_params).to eq params
    end
  end

  context '#content_params' do

    it 'returns the expected params hash' do
      activity.save
      params = {
        **activity.segment_activity.common_params,
        concepts: activity.activity_categories.pluck(:name).join(", "),
        content_partners: activity.content_partners.pluck(:name).join(", ")
      }.reject {|_,v| v.nil? }
      expect(activity.segment_activity.content_params).to eq params
    end
  end
end
