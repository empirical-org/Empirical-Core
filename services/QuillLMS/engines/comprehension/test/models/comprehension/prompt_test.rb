require 'test_helper'

module Comprehension
  class PromptTest < ActiveSupport::TestCase
    context 'relations' do
      should belong_to(:activity)
      should have_many(:automl_models)
      should have_many(:prompts_rules)
      should have_many(:rules).through(:prompts_rules)
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

    context '#after_create' do
      context '#assign_universal_rules' do
        should 'assign all universal rules to new prompts' do
          rule1 = create(:comprehension_rule, universal: true)
          rule2 = create(:comprehension_rule, universal: true)
          prompt = create(:comprehension_prompt)
          assert_equal prompt.rules.length, 2
          assert prompt.rules.include?(rule1)
          assert prompt.rules.include?(rule2)
        end

        should 'not duplicate rule assignments if some exist already' do
          rule1 = create(:comprehension_rule, universal: true)
          rule2 = create(:comprehension_rule, universal: true)
          prompt = create(:comprehension_prompt, rules: [rule1])
          assert_equal prompt.rules.length, 2
          assert prompt.rules.include?(rule1)
          assert prompt.rules.include?(rule2)
        end

        should 'not add non-universal rules' do
          universal_rule = create(:comprehension_rule, universal: true)
          non_universal_rule = create(:comprehension_rule, universal: false)
          prompt = create(:comprehension_prompt)
          assert_equal prompt.rules.length, 1
          assert prompt.rules.include?(universal_rule)
          refute prompt.rules.include?(non_universal_rule)
        end

        should 'not remove existing non-universal assignments' do
          universal_rule = create(:comprehension_rule, universal: true)
          non_universal_rule = create(:comprehension_rule, universal: false)
          prompt = create(:comprehension_prompt, rules: [non_universal_rule])
          assert_equal prompt.rules.length, 2
          assert prompt.rules.include?(universal_rule)
          assert prompt.rules.include?(non_universal_rule)
        end
      end
    end
  end
end
