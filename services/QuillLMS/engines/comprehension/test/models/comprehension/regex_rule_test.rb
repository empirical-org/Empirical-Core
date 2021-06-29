require 'test_helper'

module Comprehension
  class RegexRuleTest < ActiveSupport::TestCase

    context 'relationships' do
      should belong_to(:rule)
    end

    context 'validations' do
      should validate_presence_of(:rule)
      should validate_presence_of(:regex_text)
      should validate_length_of(:regex_text).is_at_most(200)
      should validate_inclusion_of(:case_sensitive).in_array(RegexRule::CASE_SENSITIVE_ALLOWED_VALUES)
      should validate_inclusion_of(:sequence_type).in_array(RegexRule::SEQUENCE_TYPES)
    end

    context 'custom validations' do
      setup do
        @rule = create(:comprehension_rule)
        @regex_rule = RegexRule.create(rule: @rule, regex_text: 'test regex')
      end

      should 'provide a default value for "case_sensitive"' do
        assert @regex_rule.case_sensitive
      end

      should 'not override a "case_sensitive" with the default if one is provided' do
        rule = RegexRule.create(rule: @rule, regex_text: 'test regex', case_sensitive: false)
        assert rule.valid?
        refute rule.case_sensitive
      end

      should 'validate the presence of "case_sensitive"' do
        @regex_rule.case_sensitive = nil
        refute @regex_rule.valid?
      end
    end

    context 'entry_failing?' do
      setup do
        @rule = create(:comprehension_rule)
        @regex_rule = RegexRule.create(rule: @rule, regex_text: '^test', sequence_type: 'required', case_sensitive: false)
      end

      should 'flag entry as failing if regex does not match and sequence type is required' do
        assert @regex_rule.entry_failing?('not test passing')
      end

      should 'flag entry as failing if regex matches and sequence type is incorrect' do
        @regex_rule.update(sequence_type: 'incorrect')
        assert @regex_rule.entry_failing?('test regex')
      end

      should 'flag entry as failing case-insensitive if the regex_rule is case insensitive' do
        @regex_rule.update(sequence_type: 'incorrect')
        assert @regex_rule.entry_failing?('TEST REGEX')
      end

      should 'not flag entry as failing if the regex_rule is case sensitive and the casing does not match' do
        @regex_rule.update(sequence_type: 'incorrect', case_sensitive: true)
        refute @regex_rule.entry_failing?('TEST REGEX')
      end
    end

    context 'is_incorrect_sequence?' do

      should 'be true if regex rule is incorrect sequence_type' do
        incorrect_rule = create(:comprehension_regex_rule, sequence_type: 'incorrect')
        assert incorrect_rule.is_incorrect_sequence?
      end

      should 'be false if regex rule is required sequence type' do
        required_rule = create(:comprehension_regex_rule, sequence_type: 'required')
        refute required_rule.is_incorrect_sequence?
      end
    end
  end
end
