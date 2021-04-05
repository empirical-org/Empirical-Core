# == Schema Information
#
# Table name: feedback_histories
#
#  id                   :integer          not null, primary key
#  activity_session_uid :text
#  attempt              :integer          not null
#  concept_uid          :text
#  entry                :text             not null
#  feedback_text        :text
#  feedback_type        :text             not null
#  metadata             :jsonb
#  optimal              :boolean          not null
#  prompt_type          :string
#  rule_uid             :string
#  time                 :datetime         not null
#  used                 :boolean          not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  prompt_id            :integer
#
# Indexes
#
#  index_feedback_histories_on_activity_session_uid  (activity_session_uid)
#  index_feedback_histories_on_concept_uid           (concept_uid)
#  index_feedback_histories_on_prompt_type_and_id    (prompt_type,prompt_id)
#  index_feedback_histories_on_rule_uid              (rule_uid)
#
require 'rails_helper'

# it { shoulda cheatsheet: https://github.com/thoughtbot/it { shoulda-matchers#activemodel-matchers
RSpec.describe FeedbackHistory, type: :model do

  context 'associations' do
    it { should belong_to(:activity_session) }
    it { should belong_to(:prompt) }
    it { should belong_to(:concept).with_foreign_key(:concept_uid).with_primary_key(:uid) }
  end

  context 'validations' do
    it { should validate_presence_of(:activity_session_uid) }

    it { should validate_presence_of(:attempt) }
    it do
       should validate_numericality_of(:attempt)
        .only_integer
        .is_greater_than_or_equal_to(1)
        .is_less_than_or_equal_to(5)
    end

    it { should validate_length_of(:concept_uid).is_equal_to(22) }

    it { should validate_presence_of(:entry) }
    it { should validate_length_of(:entry).is_at_least(5).is_at_most(500) }

    it { should validate_length_of(:feedback_text).is_at_least(10).is_at_most(500) }

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
      @activity = create(:comprehension_activity)
      @activity_session = create(:activity_session, activity_id: @activity.id)
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

    it 'should return empty hash when there is no concept' do
      feedback_history = create(:feedback_history, activity_session_uid: @activity_session.uid, concept: nil, prompt: @prompt)
      concept_results_hash = feedback_history.concept_results_hash

      assert_equal concept_results_hash, {}
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
      assert_equal json_hash['rule_uid'], @feedback_history.rule_uid

      assert_equal json_hash['prompt'], @feedback_history.prompt.as_json
      assert_equal json_hash['prompt']['text'], @prompt.text
    end
  end

  context 'batch_create' do
    setup do
      @valid_fh_params = {
        activity_session_uid: SecureRandom.uuid,
        attempt: 1,
	entry: 'This is the student entry',
	feedback_text: 'This is the feedback text',
	feedback_type: 'semantic',
	optimal: false,
	time: Time.now,
	used: true
      }
      @invalid_fh_params = {}
    end

    it 'should save and return if all creations are valid' do
        assert_equal FeedbackHistory.count, 0
	FeedbackHistory.batch_create([@valid_fh_params, @valid_fh_params, @valid_fh_params])
	assert_equal FeedbackHistory.count, 3
    end

    it 'should save any valid records if, but not any valid ones' do
        assert_equal FeedbackHistory.count, 0
	results = FeedbackHistory.batch_create([@invalid_fh_params, @valid_fh_params])
	assert_equal FeedbackHistory.count, 1
        assert results[0].errors[:entry].include?("can't be blank")
        assert results[1].valid?
    end
  end

  context 'before_validation: ensure_prompt_type' do
    it 'should set default prompt_type if prompt_id is set, but prompt_type is not' do
      fh = FeedbackHistory.create(prompt_id: 1)
      assert_equal fh.prompt_type, FeedbackHistory::DEFAULT_PROMPT_TYPE
    end

    it 'should not set prompt_type if there is no prompt_id' do
      fh = FeedbackHistory.create
      refute fh.prompt_type
    end

    it 'should not set prompt_type if prompt_type is provided' do
      fh = FeedbackHistory.create(prompt_id: 1, prompt_type: 'MadeUp')
      assert_equal fh.prompt_type, 'MadeUp'
    end
  end

  context 'Session-aggregate FeedbackHistories' do
    setup do
      @activity1 = Comprehension::Activity.create!(name: 'Title_1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
      @activity2 = Comprehension::Activity.create!(name: 'Title_2', title: 'Title 2', parent_activity_id: 2, target_level: 1)
      @because_prompt1 = Comprehension::Prompt.create!(activity: @activity1, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      @because_prompt2 = Comprehension::Prompt.create!(activity: @activity2, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      @but_prompt1 = Comprehension::Prompt.create!(activity: @activity1, conjunction: 'but', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      @but_prompt2 = Comprehension::Prompt.create!(activity: @activity2, conjunction: 'but', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      @so_prompt1 = Comprehension::Prompt.create!(activity: @activity1, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      @so_prompt2 = Comprehension::Prompt.create!(activity: @activity2, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
  
      @session1_uid = SecureRandom.uuid
      @session2_uid = SecureRandom.uuid
  
      @first_session_feedback1 = create(:feedback_history, activity_session_uid: @session1_uid, prompt_id: @because_prompt1.id, optimal: false)
      @first_session_feedback2 = create(:feedback_history, activity_session_uid: @session1_uid, prompt_id: @because_prompt1.id, attempt: 2, optimal: true)
      @first_session_feedback3 = create(:feedback_history, activity_session_uid: @session1_uid, prompt_id: @but_prompt1.id, optimal: true)
      @first_session_feedback4 = create(:feedback_history, activity_session_uid: @session1_uid, prompt_id: @so_prompt1.id, optimal: false)
      @first_session_feedback5 = create(:feedback_history, activity_session_uid: @session1_uid, prompt_id: @so_prompt1.id, attempt: 2, optimal: false)
      @first_session_feedback6 = create(:feedback_history, activity_session_uid: @session1_uid, prompt_id: @so_prompt1.id, attempt: 3, optimal: true)
      @second_session_feedback = create(:feedback_history, activity_session_uid: @session2_uid, prompt_id: @because_prompt2.id, optimal: false)
      create(:feedback_history, activity_session_uid: @session2_uid, prompt_id: @because_prompt2.id, attempt: 2, optimal: false)
    end
  
    context '#list_by_activity_session' do
      it 'should identify two records when there are two unique activity_session_uids' do
        assert_equal FeedbackHistory.list_by_activity_session.length, 2
      end
  
      it 'should sort newest first' do
        assert_equal FeedbackHistory.list_by_activity_session[0].session_uid, @session2_uid
      end
  
      it 'should only return enough items as specified via page_size' do
        responses = FeedbackHistory.list_by_activity_session(page_size: 1)
        assert_equal responses.length, 1
        assert_equal responses[0].session_uid, @session2_uid
      end
  
      it 'should skip pages when specified via page' do
        responses = FeedbackHistory.list_by_activity_session(page: 2, page_size: 1)
        assert_equal responses.length, 1
        assert_equal responses[0].session_uid, @session1_uid
      end
  
      it 'should identify a session as incomplete if not all prompts have optimal feedback or too many attempts' do
        assert_equal FeedbackHistory.list_by_activity_session[0].complete, false
      end
  
      it 'should identify a session as complete if all prompts have an optimal response in feedback history' do
        assert_equal FeedbackHistory.list_by_activity_session[1].complete, true
      end
  
      it 'should identify a session as complete if all prompts have optimal responses or too many attempts' do
      create(:feedback_history, activity_session_uid: @session2_uid, prompt_id: @because_prompt2.id, attempt: 3, optimal: true)
        5.times {|i| create(:feedback_history, activity_session_uid: @session2_uid, prompt_id: @but_prompt2.id, attempt: i + 1, optimal: false) }
        5.times {|i| create(:feedback_history, activity_session_uid: @session2_uid, prompt_id: @so_prompt2.id, attempt: i + 1, optimal: false) }
        assert_equal FeedbackHistory.list_by_activity_session[0].complete, true
      end
    end
  
    context '#serialize_list_by_activity_session' do
      it 'should take the query from #list_by_activity_session and return a shaped payload' do
        responses = FeedbackHistory.list_by_activity_session
        assert_equal responses.map { |r| r.serialize_by_activity_session }.to_json, [
          {
            session_uid: @session2_uid,
            start_date: @second_session_feedback.time.iso8601(3),
            activity_id: @activity2.id,
            because_attempts: 2,
            but_attempts: 0,
            so_attempts: 0,
            complete: false
          }, {
            session_uid: @session1_uid,
            start_date: @first_session_feedback1.time.iso8601(3),
            activity_id: @activity1.id,
            because_attempts: 2,
            but_attempts: 1,
            so_attempts: 3,
            complete: true
          }
        ].to_json
      end
    end
  
    context '#serialize_detail_by_activity_session' do
      it 'should build the expeted payload' do
        payload = FeedbackHistory.serialize_detail_by_activity_session(@session1_uid)
  
        assert_equal payload[:start_date], @first_session_feedback1.time.iso8601
        assert_equal payload[:session_uid], @first_session_feedback1.activity_session_uid
        assert_equal payload[:activity_id], @activity1.id
        assert_equal payload[:session_completed], true
  
        assert_equal payload[:prompts][0][:prompt_id], @because_prompt1.id
        assert_equal payload[:prompts][0][:conjunction], @because_prompt1.conjunction
  
        assert_equal payload[:prompts][0][:attempts][1][0][:used], @first_session_feedback1.used
        assert_equal payload[:prompts][0][:attempts][1][0][:entry], @first_session_feedback1.entry
        assert_equal payload[:prompts][0][:attempts][1][0][:feedback_text], @first_session_feedback1.feedback_text
        assert_equal payload[:prompts][0][:attempts][1][0][:feedback_type], @first_session_feedback1.feedback_type
        assert_equal payload[:prompts][0][:attempts][1][0][:optimal], @first_session_feedback1.optimal
  
        assert_equal payload[:prompts][0][:attempts][2][0][:used], @first_session_feedback2.used
        assert_equal payload[:prompts][0][:attempts][2][0][:entry], @first_session_feedback2.entry
        assert_equal payload[:prompts][0][:attempts][2][0][:feedback_text], @first_session_feedback2.feedback_text
        assert_equal payload[:prompts][0][:attempts][2][0][:feedback_type], @first_session_feedback2.feedback_type
        assert_equal payload[:prompts][0][:attempts][2][0][:optimal], @first_session_feedback2.optimal
  
        assert_equal payload[:prompts][1][:prompt_id], @but_prompt1.id
        assert_equal payload[:prompts][1][:conjunction], @but_prompt1.conjunction
  
        assert_equal payload[:prompts][1][:attempts][1][0][:used], @first_session_feedback3.used
        assert_equal payload[:prompts][1][:attempts][1][0][:entry], @first_session_feedback3.entry
        assert_equal payload[:prompts][1][:attempts][1][0][:feedback_text], @first_session_feedback3.feedback_text
        assert_equal payload[:prompts][1][:attempts][1][0][:feedback_type], @first_session_feedback3.feedback_type
        assert_equal payload[:prompts][1][:attempts][1][0][:optimal], @first_session_feedback3.optimal
  
        assert_equal payload[:prompts][2][:prompt_id], @so_prompt1.id
        assert_equal payload[:prompts][2][:conjunction], @so_prompt1.conjunction
  
        assert_equal payload[:prompts][2][:attempts][1][0][:used], @first_session_feedback4.used
        assert_equal payload[:prompts][2][:attempts][1][0][:entry], @first_session_feedback4.entry
        assert_equal payload[:prompts][2][:attempts][1][0][:feedback_text], @first_session_feedback4.feedback_text
        assert_equal payload[:prompts][2][:attempts][1][0][:feedback_type], @first_session_feedback4.feedback_type
        assert_equal payload[:prompts][2][:attempts][1][0][:optimal], @first_session_feedback4.optimal
  
        assert_equal payload[:prompts][2][:attempts][2][0][:used], @first_session_feedback5.used
        assert_equal payload[:prompts][2][:attempts][2][0][:entry], @first_session_feedback5.entry
        assert_equal payload[:prompts][2][:attempts][2][0][:feedback_text], @first_session_feedback5.feedback_text
        assert_equal payload[:prompts][2][:attempts][2][0][:feedback_type], @first_session_feedback5.feedback_type
        assert_equal payload[:prompts][2][:attempts][2][0][:optimal], @first_session_feedback5.optimal
  
        assert_equal payload[:prompts][2][:attempts][3][0][:used], @first_session_feedback6.used
        assert_equal payload[:prompts][2][:attempts][3][0][:entry], @first_session_feedback6.entry
        assert_equal payload[:prompts][2][:attempts][3][0][:feedback_text], @first_session_feedback6.feedback_text
        assert_equal payload[:prompts][2][:attempts][3][0][:feedback_type], @first_session_feedback6.feedback_type
        assert_equal payload[:prompts][2][:attempts][3][0][:optimal], @first_session_feedback6.optimal
      end
    end
  end
end
