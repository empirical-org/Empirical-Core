require 'test_helper'

module Comprehension
  class RegexMigrationRunnerTest < ActiveSupport::TestCase
    setup do
      @prompt = create(:comprehension_prompt)
      @rule_set = create(:comprehension_rule_set, prompt_ids: [@prompt.id])
      @regex_rule = create(:comprehension_regex_rule, rule_set: @rule_set)
    end

    should 'run' do
      Comprehension::RegexMigrationRunner.run
      new_rule = Comprehension::Rule.find_by(name: @rule_set.name, suborder: @rule_set.priority)
      assert new_rule.present?
      assert_equal new_rule.prompt_ids, [@prompt.id]
      assert_equal @prompt.rule_ids, [new_rule.id]
      assert Comprehension::Feedback.find_by(text: @rule_set.feedback).present?
      assert_equal @regex_rule.reload.rule_id, new_rule.id
    end
  end
end