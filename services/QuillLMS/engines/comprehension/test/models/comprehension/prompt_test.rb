require 'test_helper'

module Comprehension
  class PromptTest < ActiveSupport::TestCase
    context 'relations' do
      should belong_to(:activity)
    end

    context 'validations' do
      should validate_presence_of(:activity)

      should validate_inclusion_of(:max_attempts)
        .in_array([3,4,5,6])

      should validate_presence_of(:text)
      should validate_length_of(:text)
        .is_at_least(10)
        .is_at_most(255)
      should validate_presence_of(:conjunction)
      should validate_inclusion_of(:conjunction)
        .in_array(%w(because but so))
    end
  end
end
