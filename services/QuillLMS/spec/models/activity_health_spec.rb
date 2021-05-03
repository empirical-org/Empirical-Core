# == Schema Information
#
# Table name: activity_healths
#
#  id                      :integer          not null, primary key
#  activity_categories     :string           is an Array
#  activity_packs          :jsonb
#  avg_common_unmatched    :float
#  avg_difficulty          :float
#  avg_mins_to_complete    :float
#  content_partners        :string           is an Array
#  diagnostics             :string           is an Array
#  flag                    :string
#  name                    :string
#  recent_plays            :integer
#  standard_dev_difficulty :float
#  tool                    :string
#  url                     :string
#
require 'rails_helper'

describe ActivityHealth, type: :model, redis: true do

  it { should have_many(:prompt_healths)}

  it { should validate_inclusion_of(:flag).in_array(ActivityHealth::FLAGS)}
  it { should validate_inclusion_of(:tool).in_array(ActivityHealth::ALLOWED_TOOLS)}
  it { should validate_numericality_of(:recent_plays).is_greater_than_or_equal_to(0)}
  it { should validate_inclusion_of(:avg_difficulty).in_range(0..5)}

  context '#serializable_hash' do
    it 'serialize into the expected shape' do
      prompt_health = create(:prompt_health)
      activity_health = create(:activity_health, prompt_healths: [prompt_health])
      expect(activity_health.serializable_hash).to eq({
        id: activity_health.id,
        name: activity_health.name,
        url: activity_health.url,
        activity_categories: activity_health.activity_categories,
        content_partners: activity_health.content_partners,
        tool: activity_health.tool,
        diagnostics: activity_health.diagnostics,
        avg_difficulty: activity_health.avg_difficulty,
        avg_common_unmatched: activity_health.avg_common_unmatched,
        standard_dev_difficulty: activity_health.standard_dev_difficulty,
        recent_plays: activity_health.recent_plays,
        avg_mins_to_complete: activity_health.avg_mins_to_complete,
        flag: activity_health.flag,
        activity_packs: activity_health.activity_packs,
        prompt_healths: activity_health.prompt_healths.as_json
      }.stringify_keys)
    end
  end

end
