# == Schema Information
#
# Table name: prompt_healths
#
#  id                           :integer          not null, primary key
#  difficulty                   :float
#  flag                         :string
#  focus_points                 :integer
#  incorrect_sequences          :integer
#  percent_common_unmatched     :float
#  percent_reached_optimal      :float
#  percent_specified_algorithms :float
#  text                         :string
#  url                          :string
#  activity_health_id           :integer
#
# Foreign Keys
#
#  fk_rails_...  (activity_health_id => activity_healths.id) ON DELETE => cascade
#
require 'rails_helper'

describe PromptHealth, type: :model, redis: true do

  it { should belong_to(:activity_health)}

  it { should validate_inclusion_of(:flag).in_array(PromptHealth::FLAGS)}
  it { should validate_numericality_of(:incorrect_sequences).is_greater_than_or_equal_to(0)}
  it { should validate_numericality_of(:focus_points).is_greater_than_or_equal_to(0)}
  it { should validate_inclusion_of(:percent_common_unmatched).in_range(0..100)}
  it { should validate_inclusion_of(:percent_specified_algorithms).in_range(0..100)}
  it { should validate_inclusion_of(:percent_reached_optimal).in_range(0..100)}
  it { should validate_inclusion_of(:difficulty).in_range(0..5)}

end
