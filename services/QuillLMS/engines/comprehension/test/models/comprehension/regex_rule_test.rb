require 'test_helper'

module Comprehension
  class RegexRuleTest < ActiveSupport::TestCase

    context 'relationships' do
      should belong_to(:rule_set)
      should belong_to(:rule)
    end

    context 'validations' do
      should validate_presence_of(:rule_set)
      should validate_presence_of(:regex_text)
      should validate_length_of(:regex_text).is_at_most(200)
    end

    context 'custom validations' do
      setup do
        @rule_set = create(:comprehension_rule_set, name: 'Test Rule Set', feedback: 'Feedback' * 10, priority: 0)
        @rule = RegexRule.create(rule_set: @rule_set, regex_text: 'test regex')
      end

      should 'provide a default value for "case_sensitive"' do
        assert @rule.case_sensitive
      end

      should 'not override a "case_sensitive" with the default if one is provided' do
        rule = RegexRule.create(rule_set: @rule_set, regex_text: 'test regex', case_sensitive: false)
        assert rule.valid?
        refute rule.case_sensitive
      end

      should 'validate the presence of "case_sensitive"' do
        @rule.case_sensitive = nil
        refute @rule.valid?
      end
    end
  end
end
