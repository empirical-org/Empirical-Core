require 'test_helper'

module Comprehension
  class FeedbackTest < ActiveSupport::TestCase

    context 'validations' do
      subject { FactoryBot.build(:comprehension_feedback) }
      should validate_presence_of(:text)
      should validate_length_of(:text).is_at_least(10).is_at_most(500)
      should validate_numericality_of(:order).only_integer.is_greater_than_or_equal_to(0)
      should validate_uniqueness_of(:order).scoped_to(:rule_id)
    end

    context 'relationships' do
      should belong_to(:rule)
    end
  end
end
