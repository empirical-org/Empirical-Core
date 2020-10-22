require 'test_helper'

# shoulda cheatsheet: https://github.com/thoughtbot/shoulda-matchers#activemodel-matchers
module Comprehension
  class FeedbackHistoryTest < ActiveSupport::TestCase

    context 'associations' do
      should belong_to(:activity_session)
      should belong_to(:prompt)
      should belong_to(:concept).with_foreign_key(:concept_uid).with_primary_key(:uid)
    end

    context 'validations' do

      should validate_presence_of(:attempt)
      should validate_numericality_of(:attempt)
        .only_integer
        .is_greater_than_or_equal_to(1)
        .is_less_than_or_equal_to(5)

      should validate_length_of(:concept_uid).is_equal_to(22)

      should validate_presence_of(:entry)
      should validate_length_of(:entry).is_at_least(25).is_at_most(500)

      should validate_length_of(:feedback_text).is_at_least(25).is_at_most(500)

      should validate_presence_of(:feedback_type)
      should validate_inclusion_of(:feedback_type).in_array(FeedbackHistory::FEEDBACK_TYPES)

      should allow_value(true).for(:optimal)
      should allow_value(false).for(:optimal)

      should allow_value(true).for(:used)
      should allow_value(false).for(:used)

      should validate_presence_of(:time)
    end

    context 'serializable_hash' do
      setup do
        @feedback_history = create(:comprehension_feedback_history)
      end

      should 'fill out hash with all fields' do
        json_hash = @feedback_history.as_json

        assert_equal json_hash['id'], @feedback_history.id
        assert_equal json_hash['activity_session_uid'], @feedback_history.activity_session_uid
        assert_equal json_hash['concept_uid'], @feedback_history.concept_uid
        assert_equal json_hash['attempt'], @feedback_history.attempt
        assert_equal json_hash['entry'], @feedback_history.entry
        assert_equal json_hash['optimal'], @feedback_history.optimal
        assert_equal json_hash['used'], @feedback_history.used
        assert_equal json_hash['feedback_text'], @feedback_history.feedback_text
        assert_equal json_hash['feedback_type'], @feedback_history.feedback_type
        assert_equal json_hash['time'], @feedback_history.time
        assert_equal json_hash['metadata'], @feedback_history.metadata

        assert_equal json_hash['prompt'], @feedback_history.prompt.as_json
      end
    end
  end
end
