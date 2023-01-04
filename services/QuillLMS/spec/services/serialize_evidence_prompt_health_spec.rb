# frozen_string_literal: true

require 'rails_helper'

describe 'SerializeEvidencePromptHealth' do

  before do
    @activity = Evidence::Activity.create!(notes: 'Title_1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
    @activity.update(flag: "production")
    @previous_version = @activity.version
    @activity.increment_version!

    @because_prompt1 = Evidence::Prompt.create!(activity: @activity, conjunction: 'because', text: 'Some feedback text because', max_attempts_feedback: 'Feedback')
    @activity_session1 = create(:activity_session, state: "finished", data: {time_tracking: {because: 600}})
    @activity_session2 = create(:activity_session, state: "finished", data: {time_tracking: {because: 250}})
    @activity_session3 = create(:activity_session, state: "started", data: {time_tracking: {because: 200}})
    @activity_session4 = create(:activity_session, state: "finished")
    @activity_session5 = create(:activity_session, state: "finished", data: {time_tracking: {because: 100}})
    @activity_session1_uid = @activity_session1.uid
    @feedback_session1_uid = FeedbackSession.get_uid_for_activity_session(@activity_session1_uid)
    @activity_session2_uid = @activity_session2.uid
    @feedback_session2_uid = FeedbackSession.get_uid_for_activity_session(@activity_session2_uid)
    @activity_session3_uid = @activity_session3.uid
    @feedback_session3_uid = FeedbackSession.get_uid_for_activity_session(@activity_session3_uid)
    @activity_session4_uid = @activity_session4.uid
    @feedback_session4_uid = FeedbackSession.get_uid_for_activity_session(@activity_session4_uid)
    @activity_session5_uid = @activity_session5.uid
    @feedback_session5_uid = FeedbackSession.get_uid_for_activity_session(@activity_session5_uid)
    @comprehension_turking_round = create(:comprehension_turking_round_activity_session, activity_session_uid: @activity_session1_uid)

    @automl_rule = Evidence::Rule.create!(name: "rule", universal: false, state: "active", optimal: false, rule_type: Evidence::Rule::TYPE_AUTOML)
    Evidence::PromptsRule.create!(prompt: @because_prompt1, rule: @automl_rule)
    @plagiarism_rule = Evidence::Rule.create!(name: "rule", universal: false, state: "active", optimal: false, rule_type: Evidence::Rule::TYPE_PLAGIARISM)
    Evidence::PromptsRule.create!(prompt: @because_prompt1, rule: @plagiarism_rule)
    @opinion_rule = Evidence::Rule.create!(name: "rule", universal: false, state: "active", optimal: false, rule_type: Evidence::Rule::TYPE_OPINION)
    Evidence::PromptsRule.create!(prompt: @because_prompt1, rule: @opinion_rule)
    @grammar_rule = Evidence::Rule.create!(name: "rule", universal: false, state: "active", optimal: false, rule_type: Evidence::Rule::TYPE_GRAMMAR)
    Evidence::PromptsRule.create!(prompt: @because_prompt1, rule: @grammar_rule)
    @spelling_rule = Evidence::Rule.create!(name: "rule", universal: false, state: "active", optimal: false, rule_type: Evidence::Rule::TYPE_SPELLING)
    Evidence::PromptsRule.create!(prompt: @because_prompt1, rule: @spelling_rule)

    @user = create(:user)
    @first_session_feedback1 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, prompt_id: @because_prompt1.id, optimal: false, activity_version: @activity.version, metadata: {api: {confidence: 0.99}}, rule_uid: @automl_rule.uid)
    @first_session_feedback2 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, prompt_id: @because_prompt1.id, attempt: 2, optimal: true, activity_version: @activity.version, metadata: {api: {confidence: 0.87}}, rule_uid: @plagiarism_rule.uid)

    @second_session_feedback = create(:feedback_history, feedback_session_uid: @activity_session2_uid, prompt_id: @because_prompt1.id, optimal: true, activity_version: @activity.version, rule_uid: @spelling_rule.uid)

    @third_session_feedback1 = create(:feedback_history, feedback_session_uid: @activity_session3_uid, prompt_id: @because_prompt1.id, optimal: false, activity_version: @activity.version, metadata: {api: {confidence: 0.65}}, rule_uid: @grammar_rule.uid)
    @third_session_feedback2 = create(:feedback_history, feedback_session_uid: @activity_session3_uid, prompt_id: @because_prompt1.id, attempt: 2, optimal: false, activity_version: @activity.version, metadata: {api: {confidence: 0.44}}, rule_uid: @automl_rule.uid)
    @third_session_feedback3 = create(:feedback_history, feedback_session_uid: @activity_session3_uid, prompt_id: @because_prompt1.id, attempt: 3, optimal: false, activity_version: @activity.version, metadata: {api: {confidence: 0.99}}, rule_uid: @grammar_rule.uid)
    @third_session_feedback4 = create(:feedback_history, feedback_session_uid: @activity_session3_uid, prompt_id: @because_prompt1.id, attempt: 4, optimal: false, activity_version: @activity.version, metadata: {api: {confidence: 0.99}}, rule_uid: @opinion_rule.uid)
    @third_session_feedback5 = create(:feedback_history, feedback_session_uid: @activity_session3_uid, prompt_id: @because_prompt1.id, attempt: 5, optimal: false, activity_version: @activity.version, metadata: {api: {confidence: 0.99}}, rule_uid: @automl_rule.uid)

    @fourth_session_feedback = create(:feedback_history, feedback_session_uid: @activity_session4_uid, prompt_id: @because_prompt1.id, optimal: true, activity_version: @previous_version, metadata: {api: {confidence: 0.99}}, rule_uid: @grammar_rule.uid)
    create(:feedback_history, feedback_session_uid: @activity_session4_uid, prompt_id: @because_prompt1.id, attempt: 2, optimal: false, activity_version: @previous_version, metadata: {api: {confidence: 0.99}}, rule_uid: @grammar_rule.uid)

    @fifth_session_feedback = create(:feedback_history, feedback_session_uid: @activity_session5_uid, prompt_id: @because_prompt1.id, optimal: false, activity_version: @activity.version, rule_uid: @opinion_rule.uid)
    @fifth_session_feedback2 = create(:feedback_history, feedback_session_uid: @activity_session5_uid, prompt_id: @because_prompt1.id, attempt: 2, optimal: true, activity_version: @activity.version, rule_uid: @grammar_rule.uid)

    @prompt_feedback_history = PromptFeedbackHistory.run({activity_id: @activity.id, activity_version: @activity.version})
  end

  let(:expected_results) do
    {
      prompt_id: @because_prompt1.id,
      activity_short_name: @activity.notes,
      text: @because_prompt1.text,
      current_version: @activity.version,
      version_responses: 10,
      first_attempt_optimal: 25,
      final_attempt_optimal: 75,
      avg_attempts: 2.5,
      confidence: 0.85,
      percent_automl_consecutive_repeated: 0,
      percent_automl: 30,
      percent_plagiarism: 10,
      percent_opinion: 20,
      percent_grammar: 30,
      percent_spelling: 10,
      avg_time_spent_per_prompt: 287
    }
  end

  it 'correct basic data for that prompt' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data).to eq expected_results
  end
end
