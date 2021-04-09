# == Schema Information
#
# Table name: feedback_histories
#
#  id            :integer          not null, primary key
#  attempt       :integer          not null
#  concept_uid   :text
#  entry         :text             not null
#  feedback_text :text
#  feedback_type :text             not null
#  metadata      :jsonb
#  optimal       :boolean          not null
#  prompt_type   :string
#  rule_uid      :string
#  session_uid   :text
#  time          :datetime         not null
#  used          :boolean          not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  prompt_id     :integer
#
# Indexes
#
#  index_feedback_histories_on_concept_uid         (concept_uid)
#  index_feedback_histories_on_prompt_type_and_id  (prompt_type,prompt_id)
#  index_feedback_histories_on_rule_uid            (rule_uid)
#  index_feedback_histories_on_session_uid         (session_uid)
#
require 'rails_helper'

# it { shoulda cheatsheet: https://github.com/thoughtbot/it { shoulda-matchers#activemodel-matchers
RSpec.describe FeedbackHistory, type: :model do

  context 'associations' do
    it { should belong_to(:activity_session_feedback_history) }
    it { should have_one(:activity_session).through(:activity_session_feedback_history) }
    it { should belong_to(:prompt) }
    it { should belong_to(:concept).with_foreign_key(:concept_uid).with_primary_key(:uid) }
  end

  context 'validations' do
    it { should validate_presence_of(:session_uid) }

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
      @feedback_history = create(:feedback_history, session_uid: @activity_session.uid, concept: @concept, prompt: @prompt)
    end

    it 'should fill out hash with all fields' do
      concept_results_hash = @feedback_history.concept_results_hash

      expect(concept_results_hash[:concept_uid]).to eq(@feedback_history.concept_uid)
      expect(concept_results_hash[:activity_session_id]).to eq(@feedback_history.activity_session.id)
      expect(concept_results_hash[:activity_classification_id]).to eq(7)
      expect(concept_results_hash[:concept_id]).to eq(@feedback_history.concept.id)
      expect(concept_results_hash[:metadata]).to eq({correct: 1, answer: @feedback_history.entry, feedback_type: @feedback_history.feedback_type})
    end

    it 'should return empty hash when there is no concept' do
      feedback_history = create(:feedback_history, session_uid: @activity_session.uid, concept: nil, prompt: @prompt)
      concept_results_hash = feedback_history.concept_results_hash

      expect(concept_results_hash).to eq({})
    end
  end

  context 'serializable_hash' do
    setup do
      @prompt = Comprehension::Prompt.create(text: 'Test text')
      @feedback_history = create(:feedback_history, prompt: @prompt)
    end

    it 'should fill out hash with all fields' do
      json_hash = @feedback_history.as_json

      expect(json_hash['id']).to eq(@feedback_history.id)
      expect(json_hash['session_uid']).to eq(@feedback_history.session_uid)
      expect(json_hash['concept_uid']).to eq(@feedback_history.concept_uid)
      expect(json_hash['attempt']).to eq(@feedback_history.attempt)
      expect(json_hash['entry']).to eq(@feedback_history.entry)
      expect(json_hash['optimal']).to eq(@feedback_history.optimal)
      expect(json_hash['used']).to eq(@feedback_history.used)
      expect(json_hash['feedback_text']).to eq(@feedback_history.feedback_text)
      expect(json_hash['feedback_type']).to eq(@feedback_history.feedback_type)
      expect(json_hash['time']).to eq(@feedback_history.time)
      expect(json_hash['metadata']).to eq(@feedback_history.metadata)
      expect(json_hash['rule_uid']).to eq(@feedback_history.rule_uid)

      expect(json_hash['prompt']).to eq(@feedback_history.prompt.as_json)
      expect(json_hash['prompt']['text']).to eq(@prompt.text)
    end
  end

  context 'batch_create' do
    setup do
      @valid_fh_params = {
        session_uid: SecureRandom.uuid,
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
        expect(FeedbackHistory.count).to eq(0)
	FeedbackHistory.batch_create([@valid_fh_params, @valid_fh_params, @valid_fh_params])
	expect(FeedbackHistory.count).to eq(3)
    end

    it 'should save any valid records if, but not any valid ones' do
        expect(FeedbackHistory.count).to eq(0)
	results = FeedbackHistory.batch_create([@invalid_fh_params, @valid_fh_params])
	expect(FeedbackHistory.count).to eq(1)
        expect(results[0].errors[:entry].include?("can't be blank")).to be
        expect(results[1].valid?).to be
    end
  end

  context 'before_validation: ensure_prompt_type' do
    it 'should set default prompt_type if prompt_id is set, but prompt_type is not' do
      fh = FeedbackHistory.create(prompt_id: 1)
      expect(fh.prompt_type).to eq(FeedbackHistory::DEFAULT_PROMPT_TYPE)
    end

    it 'should not set prompt_type if there is no prompt_id' do
      fh = FeedbackHistory.create
      expect(fh.prompt_type).not_to be
    end

    it 'should not set prompt_type if prompt_type is provided' do
      fh = FeedbackHistory.create(prompt_id: 1, prompt_type: 'MadeUp')
      expect(fh.prompt_type).to eq('MadeUp')
    end
  end

  context 'before_validation: anonymize_session_uid' do
    before(:each) do
      @feedback_history = build(:feedback_history)
    end

    it 'should do nothing if session_uid is not set' do
      @feedback_history.session_uid = nil
      @feedback_history.save
      expect(@feedback_history.session_uid).to eq(nil)
    end

    it 'should create an ActivitySessionFeedbackHistory record if session_uid is set' do
      expect(ActivitySessionFeedbackHistory.count).to eq(0)

      activity_session_uid = 'fake-activity-session-uid'
      @feedback_history.session_uid = activity_session_uid
      @feedback_history.save
      @feedback_history.valid?
      
      expect(ActivitySessionFeedbackHistory.first.activity_session_uid).to eq(activity_session_uid)
      expect(ActivitySessionFeedbackHistory.count).to eq(1)
    end

    it 'should use the replace the session_uid value with the value from ActivitySessionFeedbackHistory' do
      session_uid = SecureRandom.uuid
      @feedback_history.session_uid = session_uid
      @feedback_history.save
      expect(ActivitySessionFeedbackHistory.get_feedback_session_uid(session_uid)).to eq(@feedback_history.session_uid)
    end
  end
end
