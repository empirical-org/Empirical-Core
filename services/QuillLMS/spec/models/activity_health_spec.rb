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

end
