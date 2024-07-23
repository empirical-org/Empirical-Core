# frozen_string_literal: true

require 'rails_helper'

describe ContentHubsHelper, type: :helper do
  describe '#unit_activities_include_content_activities?' do
    let(:activity) { create(:activity, id: 1) }
    let(:unit_activity) { create(:unit_activity, activity_id: activity.id) }
    let(:unit_activities) { UnitActivity.where(activity_id: unit_activity.activity_id) }

    it 'returns true if unit activities include any specified content activities' do
      content_activity_ids = [activity.id, 2, 3]

      result = helper.unit_activities_include_content_activities?(unit_activities, content_activity_ids)

      expect(result).to be true
    end

    it 'returns false if unit activities do not include any specified content activities' do
      content_activity_ids = [2, 3, 4]

      result = helper.unit_activities_include_content_activities?(unit_activities, content_activity_ids)

      expect(result).to be false
    end
  end

  describe '#world_history_1200_to_present_data' do
    it 'returns an array of world history units with the expected structure' do
      result = helper.world_history_1200_to_present_data

      expect(result).to be_an(Array)
      expect(result).not_to be_empty

      result.each do |unit|
        expect(unit).to have_key(:display_name)
        expect(unit).to have_key(:description)
        expect(unit).to have_key(:unit_template_id)
        expect(unit).to have_key(:oer_unit_website)
        expect(unit).to have_key(:oer_unit_teacher_guide)
        expect(unit).to have_key(:all_oer_articles)
        expect(unit).to have_key(:all_quill_articles_href)
        expect(unit).to have_key(:oer_unit_number)
        expect(unit).to have_key(:quill_teacher_guide_href)
        expect(unit).to have_key(:activities)

        activities = unit[:activities]
        expect(activities).to be_an(Array)
        expect(activities).to all(have_key(:activity_id))
        expect(activities).to all(have_key(:display_name))
        expect(activities).to all(have_key(:description))
        expect(activities).to all(have_key(:paired_oer_asset_name))
        expect(activities).to all(have_key(:paired_oer_asset_link))
      end
    end
  end
end
