require 'test_helper'

module Comprehension
  class RuleTest < ActiveSupport::TestCase

    context 'validations' do
      subject { FactoryBot.build(:comprehension_rule) }
      should validate_uniqueness_of(:uid)
      should validate_presence_of(:name)
      should validate_length_of(:name).is_at_most(50)
      should validate_inclusion_of(:universal).in_array(Rule::ALLOWED_BOOLEANS)
      should validate_inclusion_of(:rule_type).in_array(Rule::TYPES)
      should validate_inclusion_of(:optimal).in_array(Rule::ALLOWED_BOOLEANS)
      should validate_numericality_of(:suborder)
        .only_integer
        .is_greater_than_or_equal_to(0)
      should validate_presence_of(:concept_uid)
    end

    context 'relationships' do
      should have_one(:plagiarism_text)
      should have_many(:feedbacks)
      should have_many(:prompts_rules)
      should have_many(:prompts).through(:prompts_rules)
      should have_many(:regex_rules).dependent(:destroy)
    end

    context 'before_validation' do
      context 'assign_uid_if_missing' do
        should 'keep existing uid if already set' do
          rule = build(:comprehension_rule)
          old_uid = rule.uid
          rule.valid?
          assert_equal old_uid, rule.uid
        end
        should 'set new uid if missing' do
          rule = build(:comprehension_rule, uid: nil)
          rule.valid?
          assert_not_nil rule.uid
        end
      end
    end

    context 'serializable_hash' do
      setup do
        @rule_prompt = create(:comprehension_prompts_rule)
        @rule = @rule_prompt.rule
        @prompt = @rule_prompt.prompt
      end

      should 'fill out hash with all fields' do
        json_hash = @rule.as_json

        assert_equal json_hash['id'], @rule.id
        assert_equal json_hash['uid'], @rule.uid
        assert_equal json_hash['name'], @rule.name
        assert_equal json_hash['description'], @rule.description
        assert_equal json_hash['universal'], @rule.universal
        assert_equal json_hash['rule_type'], @rule.rule_type
        assert_equal json_hash['optimal'], @rule.optimal
        assert_equal json_hash['suborder'], @rule.suborder
        assert_equal json_hash['concept_uid'], @rule.concept_uid
        assert_equal json_hash['prompt_ids'], @rule.prompt_ids
      end
    end
  end
end
