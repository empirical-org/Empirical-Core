require 'test_helper'

module Comprehension
  class HighlightTest < ActiveSupport::TestCase


    context 'validations' do
      should validate_presence_of(:text)
      should validate_length_of(:text)
        .is_at_least(1)
        .is_at_most(5000)
      should validate_presence_of(:highlight_type)
      should validate_inclusion_of(:highlight_type)
        .in_array(Comprehension::Highlight::TYPES)
      should validate_numericality_of(:starting_index)
        .only_integer
        .is_greater_than_or_equal_to(0)
    end

    context 'relationships' do
      should belong_to(:feedback)
    end
  end
end
