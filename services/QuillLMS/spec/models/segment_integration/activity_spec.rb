# frozen_string_literal: true

require 'rails_helper'

RSpec.describe SegmentIntegration::Activity do
  let(:activity_category) { create(:activity_category) }
  let(:activity_classification) { create(:activity_classification) }
  let(:level3_topic) { create(:topic, level: 3) }
  let(:level2_topic) { create(:topic, level: 2) }
  let(:level1_topic) { create(:topic, level: 1) }
  let(:level0_topic) { create(:topic, level: 0) }
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
      activity.topics = [level0_topic, level1_topic, level2_topic, level3_topic]
      activity.save
      params = {
        **activity.segment_activity.common_params,
        concepts: activity.activity_categories.pluck(:name).join(", "),
        content_partners: activity.content_partners.pluck(:name).join(", "),
        topic_level_three: activity.topics.find(&:level_three?)&.name,
        topic_level_two: activity.topics.find(&:level_two?)&.name,
        topic_level_one: activity.topics.find(&:level_one?)&.name,
        topic_level_zero: activity.topics.find(&:level_zero?)&.name
      }.reject {|_,v| v.nil? }
      expect(activity.segment_activity.content_params).to eq params
    end
  end
end
