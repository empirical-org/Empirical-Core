# frozen_string_literal: true

require 'rails_helper'

describe ActivitySearch do
  describe 'search' do
    let!(:activity_classification) { create(:activity_classification) }
    let!(:standard) { create(:standard) }
    let!(:standard_level) { create(:standard_level) }
    let!(:activity) { create(:activity, activity_categories: [], flags: %w{beta production}, activity_classification_id: activity_classification.id, standard: standard, standard_level: standard_level) }
    let!(:beta_flagset_activity) { create(:activity, activity_categories: [], name: 'special activity', flags: %w{evidence_beta1}, activity_classification_id: activity_classification.id, standard: standard, standard_level: standard_level) }
    let!(:activity_category) { create(:activity_category) }
    let!(:activity_category_activity) { create(:activity_category_activity, activity_category: activity_category, activity: activity) }
    let!(:content_partner) { create(:content_partner) }
    let!(:content_partner_activity) { create(:content_partner_activity, content_partner: content_partner, activity: activity) }
    let!(:topic) { create(:topic) }
    let!(:activity_topic) { create(:activity_topic, topic: topic, activity: activity)}

    context 'beta flagset input' do
      it 'should get the correct attributes based on the flag given' do
        expect(described_class.search("beta").first).to eq(
          {
            "activity_name" => activity.name,
            "activity_description" => activity.description ,
            "activity_flag" => "{beta,production}",
            "activity_id" => activity.id,
            "activity_maximum_grade_level" => activity.maximum_grade_level,
            "activity_minimum_grade_level" => activity.minimum_grade_level,
            "activity_uid" => activity.uid,
            "activity_category_id" => activity_category.id,
            "activity_category_name" => activity_category.name,
            "standard_level_id" => standard_level.id,
            "standard_level_name" => standard_level.name,
            "standard_name" => standard.name,
            "topic_id" => topic.id,
            "topic_level" => topic.level,
            "topic_name" => topic.name,
            "topic_parent_id" => topic.parent_id,
            "content_partner_description" => content_partner.description,
            "content_partner_id" => content_partner.id,
            "content_partner_name" => content_partner.name,
            "order_number" => activity_category_activity.order_number,
            "classification_id" => activity_classification.id,
            "classification_key" => activity_classification.key
          }
        )
      end
    end

    context 'production flagset input' do
      it 'should not retrieve evidence_beta1-flagged activities' do
        results = described_class.search('production')
        expect(results.count).to eq 1
        expect(results.first['activity_name']).to_not eq beta_flagset_activity.name
      end
    end

  end
end
