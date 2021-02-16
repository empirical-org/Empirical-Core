require 'test_helper'

module Comprehension
  class RegexCheckTest < ActiveSupport::TestCase
    setup do
      @prompt = create(:comprehension_prompt)
      @rule = create(:comprehension_rule, rule_type: 'Regex', prompts: [@prompt], suborder: 0)
      @regex_rule = create(:comprehension_regex_rule, rule: @rule, regex_text: '^Test')
      @feedback = create(:comprehension_feedback, rule: @rule, text: 'This string begins with the word Test!')
    end

    context '#initialize' do
      should 'should have working accessor methods for all initialized fields' do
        regex_check = Comprehension::RegexCheck.new("entry", @prompt)
        assert_equal regex_check.entry, "entry"
        assert_equal regex_check.prompt, @prompt
      end
    end

    context '#feedback_object' do
      should 'return optimal blank feedback when there is no regex match' do
        optimal_rule = create(:comprehension_rule, rule_type: 'Regex', optimal: true)
        entry = "this is not a good regex match"
        regex_check = Comprehension::RegexCheck.new(entry, @prompt)
        feedback = regex_check.feedback_object
        assert_equal feedback[:feedback], Comprehension::RegexCheck::ALL_CORRECT_FEEDBACK
        assert_equal feedback[:feedback_type], Comprehension::Rule::TYPE_REGEX
        assert feedback[:optimal]
        assert_equal feedback[:entry], entry
        assert_equal feedback[:concept_uid], ''
        assert_equal feedback[:rule_uid], optimal_rule.uid
      end

      should 'be false when there is a regex match' do
        entry = "Test this is a good regex match"
        regex_check = Comprehension::RegexCheck.new(entry, @prompt)
        feedback = regex_check.feedback_object
        assert_equal feedback[:feedback], @feedback.text
        assert_equal feedback[:feedback_type], Comprehension::Rule::TYPE_REGEX
        refute feedback[:optimal]
        assert_equal feedback[:entry], entry
        assert_equal feedback[:concept_uid], @rule.concept_uid
        assert_equal feedback[:rule_uid], @rule.uid
      end

      should 'return the highest priority feedback when two feedbacks exist' do
        new_rule = create(:comprehension_rule, rule_type: 'Regex', prompts: [@prompt], suborder: 1)
        new_regex_rule = create(:comprehension_regex_rule, rule: new_rule, regex_text: '^Testing')
        entry = "Test this is a good regex match"
        regex_check = Comprehension::RegexCheck.new(entry, @prompt)
        feedback = regex_check.feedback_object
        assert_equal feedback[:rule_uid], @rule.uid
      end
    end
  end
end
