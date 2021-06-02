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
      should validate_presence_of(:conjunction)
      should validate_inclusion_of(:conjunction)
        .in_array(%w(because but so))

      context '#validate_prompt_length' do
        should 'not allow a prompt to be created that is too short' do
          activity = create(:comprehension_activity)
          prompt = build(:comprehension_prompt, conjunction: "but", text: "too short", max_attempts: 5, activity_id: activity.id)
          assert !prompt.valid?
          assert prompt.errors[:text].include?("#{prompt.conjunction} prompt too short (minimum is #{Prompt::MIN_TEXT_LENGTH} characters)")
        end
        should 'not allow a prompt to be created that is too long' do
          activity = create(:comprehension_activity)
          prompt_text = "And both that morning equally lay In leaves no step had trodden black. Oh, I kept the first for another day! Yet knowing how way leads on to way, I doubted if I should ever come back. I shall be telling this with a sigh Somewhere ages and ages hence: Two roads diverged in a wood, and I— I took the one less traveled by, And that has made all the difference."
          prompt = build(:comprehension_prompt, conjunction: "because", text: prompt_text, max_attempts: 5, activity_id: activity.id)
          assert !prompt.valid?
          assert prompt.errors[:text].include?("#{prompt.conjunction} prompt too long (maximum is #{Prompt::MAX_TEXT_LENGTH} characters)")
        end
      end
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
