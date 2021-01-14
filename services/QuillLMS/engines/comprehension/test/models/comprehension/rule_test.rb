require 'test_helper'

module Comprehension
  class RuleTest < ActiveSupport::TestCase

    context 'validations' do
      should validate_uniqueness_of(:uid)
      should validate_presence_of(:uid)
      should validate_presence_of(:name)
      should validate_length_of(:name).is_at_most(50)
      should validate_inclusion_of(:universal).in_array(Rule::ALLOWED_BOOLEANS)
      should validate_inclusion_of(:type).in_array(Rule::TYPES)
      should validate_inclusion_of(:optimal).in_array(Rule::ALLOWED_BOOLEANS)
      should validate_numericality_of(:suborder).
        only_integer.
        is_greater_than_or_equal_to(0)
      should validate_presence_of(:concept_uid)
    end

    context 'relationships' do
      # FIXME put relationship tests here.
    end
  end
end
