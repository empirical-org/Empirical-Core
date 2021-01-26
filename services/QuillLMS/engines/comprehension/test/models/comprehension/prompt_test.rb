require 'test_helper'

module Comprehension
  class PromptTest < ActiveSupport::TestCase
    context 'relations' do
      should belong_to(:activity)
      should have_many(:prompts_rules)
      should have_many(:rules).through(:prompts_rules)
      should have_many(:prompts_rule_sets)
      should have_many(:rule_sets).through(:prompts_rule_sets)
    end

    context 'validations' do
      should validate_presence_of(:activity)

      should validate_inclusion_of(:max_attempts)
        .in_array([3,4,5,6])

      should validate_presence_of(:text)
      should validate_length_of(:text)
        .is_at_least(10)
        .is_at_most(255)
      should validate_presence_of(:conjunction)
      should validate_inclusion_of(:conjunction)
        .in_array(%w(because but so))
    end
  end
end
