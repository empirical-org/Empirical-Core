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

  context '#serializable_hash' do
    should 'serialize into the expected shape' do
      prompt_health = PromptHealth.create
      assert_equal prompt_health.serializable_hash, {
        id: prompt_health.id,
        text: prompt_health.text,
        url: prompt_health.url,
        flag: prompt_health.flag,
        incorrect_sequences: prompt_health.incorrect_sequences,
        focus_points: prompt_health.focus_points,
        percent_common_unmatched: prompt_health.percent_common_unmatched,
        percent_specified_algorithms: prompt_health.percent_specified_algorithms,
        difficulty: prompt_health.difficulty,
        percent_reached_optimal: prompt_health.percent_reached_optimal
      }.stringify_keys
    end
  end

end
