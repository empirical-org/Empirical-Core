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

  it 'gets the correct basic data for that prompt' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data[:prompt_id]).to eq(prompt.id)
    expect(data[:activity_short_name]).to eq(@activity.notes)
    expect(data[:text]).to eq(prompt.text)
    expect(data[:current_version]).to eq(@activity.version)
  end

  it 'gets the correct version responses #' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data[:version_responses]).to eq(10)
  end

  it 'gets the correct first attempt optimal #' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data[:first_attempt_optimal]).to eq(25)
  end

  it 'gets the correct final attempt optimal #' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data[:final_attempt_optimal]).to eq(75)
  end

  it 'gets the correct avg_attempts #' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data[:avg_attempts]).to eq(2.5)
  end

  it 'gets the correct avg_confidence #' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data[:confidence]).to eq(0.85)
  end

  it 'gets the correct avg_time_spent' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data[:avg_time_spent_per_prompt]).to eq(287)
  end

  it 'gets the correct percent_automl' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data[:percent_automl]).to eq(30)
  end

  it 'gets the correct percent_plagiarism' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data[:percent_plagiarism]).to eq(10)
  end

  it 'gets the correct percent_opinion' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data[:percent_opinion]).to eq(20)
  end

  it 'gets the correct percent_grammar' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data[:percent_grammar]).to eq(30)
  end

  it 'gets the correct percent_spelling' do
    prompt = @because_prompt1
    data = SerializeEvidencePromptHealth.new(prompt, @prompt_feedback_history).data
    expect(data[:percent_spelling]).to eq(10)
  end
end
