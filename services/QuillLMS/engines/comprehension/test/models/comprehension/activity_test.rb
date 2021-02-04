require 'test_helper'

# shoulda cheatsheet: https://github.com/thoughtbot/shoulda-matchers#activemodel-matchers
module Comprehension
  class ActivityTest < ActiveSupport::TestCase

    context 'associations' do
      should have_many(:passages).dependent(:destroy)
      should have_many(:prompts).dependent(:destroy)
    end

    context 'validations' do
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

    context 'serializable_hash' do
      setup do
        @activity = create(:comprehension_activity, parent_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade")
        @passage = create(:comprehension_passage, activity: @activity, text: ('Hello' * 20))
        @prompt = create(:comprehension_prompt, activity: @activity, text: "it is good.", conjunction: "because", max_attempts_feedback: "good work!.")
      end

      should 'fill out hash with all fields' do
        json_hash = @activity.as_json

        assert_equal json_hash['id'], @activity.id
        assert_equal json_hash['parent_activity_id'], 1
        assert_equal json_hash['title'], "First Activity"
        assert_equal json_hash['target_level'], 8
        assert_equal json_hash['scored_level'], "4th grade"

        passage_hash = json_hash['passages'].first

        assert_equal passage_hash['id'], @passage.id
        assert_equal passage_hash['text'], ('Hello' * 20)

        prompt_hash = json_hash['prompts'].first

        assert_equal prompt_hash['id'], @prompt.id
        assert_equal prompt_hash['conjunction'], "because"
        assert_equal prompt_hash['text'], "it is good."
        assert_equal prompt_hash['max_attempts'], 5
        assert_equal prompt_hash['max_attempts_feedback'], "good work!."
      end
    end

    context 'dependent destroy' do
      should 'destroy dependent passages' do
        @activity = create(:comprehension_activity)
        @passage = create(:comprehension_passage, activity: @activity)

        @activity.destroy
        refute Passage.exists?(@passage.id)
      end

      should 'destroy dependent prompts' do
        @activity = create(:comprehension_activity)
        @prompt = create(:comprehension_prompt, activity: @activity)

        @activity.destroy
        refute Prompt.exists?(@prompt.id)
      end
    end

    context 'before_destroy' do
      should 'expire all associated Turking Rounds before destroy' do
        @activity = create(:comprehension_activity)
        @turking_round = create(:comprehension_turking_round, activity: @activity)

        assert_operator @turking_round.expires_at, :>, Time.zone.now
        @activity.destroy
        @turking_round.reload
        assert_operator @turking_round.expires_at, :<, Time.zone.now
      end
    end
  end
end
