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
<<<<<<< HEAD
      should validate_numericality_of(:suborder).
        only_integer.
        is_greater_than_or_equal_to(0)
=======
      should validate_numericality_of(:suborder)
        .only_integer
        .is_greater_than_or_equal_to(0)
>>>>>>> 0b5e51f699b43e3445965b5160b4df63fe2c6c97
      should validate_presence_of(:concept_uid)
    end

    context 'relationships' do
      should have_many(:feedbacks)
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
  end
end
