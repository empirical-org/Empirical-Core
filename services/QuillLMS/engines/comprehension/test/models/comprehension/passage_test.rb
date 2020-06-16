require 'test_helper'

module Comprehension
  class PassageTest < ActiveSupport::TestCase
    context 'relations' do
      should belong_to(:activity)
    end

    context 'validations' do
      should validate_presence_of(:activity)

      should validate_presence_of(:text)
      should validate_length_of(:text).is_at_least(50)
    end
  end
end
