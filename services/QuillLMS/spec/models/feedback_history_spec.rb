require 'rails_helper'

# it { shoulda cheatsheet: https://github.com/thoughtbot/it { shoulda-matchers#activemodel-matchers
RSpec.describe FeedbackHistory, type: :model do

  context 'associations' do
    it { should belong_to(:activity_session) }
    it { should belong_to(:prompt) }
    it { should belong_to(:concept).with_foreign_key(:concept_uid).with_primary_key(:uid) }
  end

  context 'validations' do

    it { should validate_presence_of(:attempt) }
    it do
       should validate_numericality_of(:attempt)
        .only_integer
        .is_greater_than_or_equal_to(1)
        .is_less_than_or_equal_to(5)
    end

    it { should validate_length_of(:concept_uid).is_equal_to(22) }

    it { should validate_presence_of(:entry) }
    it { should validate_length_of(:entry).is_at_least(25).is_at_most(500) }

    it { should validate_length_of(:feedback_text).is_at_least(25).is_at_most(500) }

    it { should validate_presence_of(:feedback_type) }
    it { should validate_inclusion_of(:feedback_type).in_array(FeedbackHistory::FEEDBACK_TYPES) }

    it { should allow_value(true).for(:optimal) }
    it { should allow_value(false).for(:optimal) }

    it { should allow_value(true).for(:used) }
    it { should allow_value(false).for(:used) }

    it { should validate_presence_of(:time) }
  end

  context 'concept results hash' do
    setup do
      @prompt = Comprehension::Prompt.create(text: 'Test test test text')
      @activity_session = create(:activity_session)
      @concept = create(:concept)
      @feedback_history = create(:feedback_history, activity_session_uid: @activity_session.uid, concept: @concept, prompt: @prompt)
    end

    it 'should fill out hash with all fields' do
      concept_results_hash = @feedback_history.concept_results_hash

      assert_equal concept_results_hash[:concept_uid], @feedback_history.concept_uid
      assert_equal concept_results_hash[:activity_session_id], @feedback_history.activity_session.id
      assert_equal concept_results_hash[:activity_classification_id], 7
      assert_equal concept_results_hash[:concept_id], @feedback_history.concept.id
      assert_equal concept_results_hash[:metadata], {correct: 1, answer: @feedback_history.entry, feedback_type: @feedback_history.feedback_type}
    end
  end

  context 'serializable_hash' do
    setup do
      @prompt = Comprehension::Prompt.create(text: 'Test text')
      @feedback_history = create(:feedback_history, prompt: @prompt)
    end

    it 'should fill out hash with all fields' do
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
      assert_equal json_hash['prompt']['text'], @prompt.text
    end
  end
end
