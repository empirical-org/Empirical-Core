# == Schema Information
#
# Table name: activity_healths
#
#  id                      :integer          not null, primary key
#  activity_categories     :string           is an Array
#  activity_packs          :string           is an Array
#  avg_common_unmatched    :float
#  avg_completion_time     :time
#  avg_difficulty          :float
#  content_partners        :string           is an Array
#  diagnostics             :string           is an Array
#  name                    :string
#  recent_assignments      :integer
#  standard_dev_difficulty :float
#  tool                    :string
#  url                     :string
#
require 'rails_helper'

describe ActivityHealth, type: :model, redis: true do

  it { should have_many(:prompt_healths)}

  it { should validate_inclusion_of(:tool).in_array(ActivityHealth::ALLOWED_TOOLS)}
  it { should validate_numericality_of(:recent_assignments).is_greater_than_or_equal_to(0)}
  it { should validate_inclusion_of(:avg_difficulty).in_range(0..5)}

end
