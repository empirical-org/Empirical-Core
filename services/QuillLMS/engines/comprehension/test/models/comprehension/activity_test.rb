require 'test_helper'

# shoulda cheatsheet: https://github.com/thoughtbot/shoulda-matchers#activemodel-matchers
module Comprehension
  class ActivityTest < ActiveSupport::TestCase

    context 'associations' do
      should have_many(:passages).dependent(:destroy)
    end

    context 'validations' do
      should validate_presence_of(:parent_activity_id)
      should validate_uniqueness_of(:parent_activity_id).allow_nil

      should validate_presence_of(:target_level)
      should validate_numericality_of(:target_level)
        .only_integer
        .is_greater_than_or_equal_to(1)
        .is_less_than_or_equal_to(12)

      should validate_presence_of(:title)
      should validate_length_of(:title).is_at_least(5).is_at_most(100)

      should validate_length_of(:scored_level).is_at_most(100)
    end
  end
end
