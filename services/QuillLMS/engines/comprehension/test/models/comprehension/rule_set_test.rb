require 'test_helper'

module Comprehension
  class RuleSetTest < ActiveSupport::TestCase

    context 'relationships' do
      should belong_to(:activity)
      should have_many(:prompts_rule_sets)
      should have_many(:prompts).through(:prompts_rule_sets)
      should have_many(:regex_rules).dependent(:destroy)
    end

    context 'validations' do
      should validate_presence_of(:activity)
      should validate_presence_of(:name)
      should validate_length_of(:name).is_at_most(100)
      should validate_presence_of(:feedback)
      should validate_length_of(:feedback).is_at_most(500)
      should validate_uniqueness_of(:priority)
        .scoped_to(:activity_id)
      should validate_numericality_of(:priority)
        .only_integer
        .is_greater_than_or_equal_to(0)
    end

    context 'serializable_hash' do
      setup do
        @activity = create(:comprehension_activity, title: "First Activity", target_level: 8, scored_level: "4th grade")
        @prompt = create(:comprehension_prompt, activity: @activity, text: "it is good.", conjunction: "because", max_attempts_feedback: "good work!.")
        @rule_set = create(:comprehension_rule_set, activity: @activity, prompts: [@prompt], name: 'Test Rule Set', feedback: 'Feedback' * 10, priority: 0)
        @rule = create(:comprehension_regex_rule, rule_set: @rule_set, regex_text: 'test', case_sensitive: true)
      end

      should 'fill out hash with all fields' do
        json_hash = @rule_set.as_json

        assert_equal json_hash['id'], @rule_set.id
        assert_equal json_hash['activity_id'], @activity.id
        assert_equal json_hash['name'], @rule_set.name
        assert_equal json_hash['feedback'], @rule_set.feedback
        assert_equal json_hash['priority'], @rule_set.priority

        prompt_hash = json_hash['prompts'].first

        assert_equal prompt_hash['id'], @prompt.id

        rule_hash = json_hash['regex_rules'].first

        assert_equal rule_hash['id'], @rule.id
        assert_equal rule_hash['regex_text'], @rule.regex_text
        assert_equal rule_hash['case_sensitive'], @rule.case_sensitive
      end
    end
  end
end
