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
  end
end
