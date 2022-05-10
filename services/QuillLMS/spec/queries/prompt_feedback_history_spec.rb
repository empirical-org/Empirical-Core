# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PromptFeedbackHistory, type: :model do
  def generate_feedback_history(prompt_id, session_uid: nil, attempts: 1, ends_optimally: true, created_at: Time.current)
    histories = []
    session_uid ||= SecureRandom.uuid
    (attempts - 1).times do |idx|
      histories.append(create(:feedback_history, attempt: idx + 1, optimal: false, prompt_id: prompt_id, feedback_session_uid: session_uid, created_at: created_at))
    end
    histories.append(create(:feedback_history, attempt: attempts, optimal: ends_optimally, prompt_id: prompt_id, feedback_session_uid: session_uid, created_at: created_at))
    histories
  end

  before do
    @main_activity = Evidence::Activity.create!(notes: 'Title_1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
    @unused_activity = Evidence::Activity.create!(notes: 'Title_2', title: 'Title 2', parent_activity_id: 2, target_level: 1)

    @prompt1 = Evidence::Prompt.create!(activity: @main_activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
    @prompt2 = Evidence::Prompt.create!(activity: @main_activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
    @prompt3 = Evidence::Prompt.create!(activity: @unused_activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')

    generate_feedback_history(@prompt3.id)
  end

  describe '#prompt_health_query' do
    it 'should count total relevant FeedbackHistory records as total_responses' do
      generate_feedback_history(@prompt1.id, attempts: 2)
      generate_feedback_history(@prompt1.id, attempts: 3)
      generate_feedback_history(@prompt2.id, attempts: 3)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)

      expect(result.all.map(&:total_responses)).to eq([5, 3])
    end

    it 'should not count feedback_history records from a different activity_id' do
      generate_feedback_history(@prompt1.id, attempts: 3)
      generate_feedback_history(@prompt3.id, attempts: 3)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)

      expect(result.all.length).to eq(1)
    end

    it 'should count total unique feedback_session_uids as session_count' do
      generate_feedback_history(@prompt1.id, attempts: 1)
      generate_feedback_history(@prompt1.id, attempts: 1)
      generate_feedback_history(@prompt1.id, attempts: 1)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)
      expect(result.all[0].session_count).to eq(3)
    end

    it 'should show the text of the prompt as display_name' do
      generate_feedback_history(@prompt1.id, attempts: 1)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)

      expect(result.all[0].display_name).to eq(@prompt1.text)
    end

    it 'should count the number of sessions that end optimally as num_final_attempt_optimal' do
      generate_feedback_history(@prompt1.id, attempts: 1)
      generate_feedback_history(@prompt1.id, attempts: 1)
      generate_feedback_history(@prompt1.id, attempts: 1, ends_optimally: false)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)

      expect(result.all[0].num_final_attempt_optimal).to eq(2)
    end

    it 'should count the number of sessions that do not end optimally as num_final_attempt_not_optimal' do
      generate_feedback_history(@prompt1.id, attempts: 1)
      generate_feedback_history(@prompt1.id, attempts: 1)
      generate_feedback_history(@prompt1.id, attempts: 5, ends_optimally: false)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)

      expect(result.all[0].num_final_attempt_not_optimal).to eq(1)
    end

    it 'should calculate the average number of attempts as avg_attempts' do
      generate_feedback_history(@prompt1.id, attempts: 1)
      generate_feedback_history(@prompt1.id, attempts: 2)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)

      expect(result.all[0].avg_attempts).to eq(1.5)
    end

    it 'should count the number of sessions with at least one consecutive-repeated flag as num_sessions_consecutive_repeated' do
      feedback_histories = generate_feedback_history(@prompt1.id, attempts: 3)
      generate_feedback_history(@prompt1.id)
      create(:feedback_history_flag, feedback_history: feedback_histories[1], flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_CONSECUTIVE)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)

      expect(result.all[0].num_sessions_consecutive_repeated).to eq(1)
    end

    it 'should count the number of sessions with at least one non-consecutive-repeated flag as num_sessions_non_consecutive_repeated' do
      feedback_histories = generate_feedback_history(@prompt1.id, attempts: 3)
      generate_feedback_history(@prompt1.id)
      create(:feedback_history_flag, feedback_history: feedback_histories[1], flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_NON_CONSECUTIVE)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)

      expect(result.all[0].num_sessions_non_consecutive_repeated).to eq(1)
    end

    it 'should count each session only once no matter how many flags it has' do
      feedback_histories = generate_feedback_history(@prompt1.id, attempts: 4)
      create(:feedback_history_flag, feedback_history: feedback_histories[1], flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_NON_CONSECUTIVE)
      create(:feedback_history_flag, feedback_history: feedback_histories[2], flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_NON_CONSECUTIVE)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)

      expect(result.all[0].num_sessions_non_consecutive_repeated).to eq(1)
    end

    it 'should count the number of sessions that had an optimal first feedback as num_first_attempt_optimal' do
      generate_feedback_history(@prompt1.id, attempts: 1)
      generate_feedback_history(@prompt1.id, attempts: 1)
      generate_feedback_history(@prompt1.id, attempts: 3, ends_optimally: false)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)

      expect(result.all[0].num_first_attempt_optimal).to eq(2)
    end

    it 'should count the number of sessions that had non-optimal first feedback as num_first_attempt_not_optimal' do
      generate_feedback_history(@prompt1.id, attempts: 1)
      generate_feedback_history(@prompt1.id, attempts: 1)
      generate_feedback_history(@prompt1.id, attempts: 3, ends_optimally: false)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)

      expect(result.all[0].num_first_attempt_not_optimal).to eq(1)
    end

    it 'should return sessions that match the filter params for start_date' do
      generate_feedback_history(@prompt1.id, created_at: '2021-08-03T05:00:00.000Z')
      generate_feedback_history(@prompt1.id, created_at: '2021-08-05T05:00:00.000Z')
      generate_feedback_history(@prompt1.id, created_at: '2021-08-057T05:00:00.000Z')

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id, start_date: '2021-08-04T05:00:00.000Z')
      expect(result.all[0].session_count).to eq(2)
    end

    it 'should return sessions that match the filter params for end_date' do
      generate_feedback_history(@prompt1.id, created_at: '2021-08-03T05:00:00.000Z')
      generate_feedback_history(@prompt1.id, created_at: '2021-08-05T05:00:00.000Z')
      generate_feedback_history(@prompt1.id, created_at: '2021-08-057T05:00:00.000Z')

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id, end_date: '2021-08-04T05:00:00.000Z')
      expect(result.all[0].session_count).to eq(1)
    end

    it 'should return sessions that match the filter params for turk_session_id' do
      activity_session1_uid = SecureRandom.uuid
      activity_session2_uid = SecureRandom.uuid
      feedback_session1_uid = FeedbackSession.get_uid_for_activity_session(activity_session1_uid)
      comprehension_turking_round = create(:comprehension_turking_round_activity_session, activity_session_uid: activity_session1_uid)
      first_session_feedback1 = create(:feedback_history, feedback_session_uid: activity_session1_uid, prompt_id: @prompt1.id)
      first_session_feedback2 = create(:feedback_history, feedback_session_uid: activity_session2_uid, prompt_id: @prompt1.id)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id, turk_session_id: comprehension_turking_round.turking_round_id)
      expect(result.all[0].session_count).to eq(1)
    end
  end

  describe '#serialize_results' do
    it 'should group results by prompt id' do
      generate_feedback_history(@prompt1.id, attempts: 1)
      generate_feedback_history(@prompt2.id, attempts: 1)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)
      parsed_result = PromptFeedbackHistory.serialize_results(result)

      expect(parsed_result.keys).to eq([@prompt1.id, @prompt2.id])
    end

    it 'should generate hashes with expected keys' do
      generate_feedback_history(@prompt1.id, attempts: 2)
      generate_feedback_history(@prompt2.id, attempts: 1)

      result = PromptFeedbackHistory.prompt_health_query(activity_id: @main_activity.id)
      parsed_result = PromptFeedbackHistory.serialize_results(result)

      expect(parsed_result).to eq({
  @prompt1.id => {
          prompt_id: @prompt1.id,
          total_responses: 2,
          session_count: 1,
          display_name: @prompt1.text,
          num_final_attempt_optimal: 1,
          num_final_attempt_not_optimal: 0,
          avg_attempts: 2,
          num_sessions_with_consecutive_repeated_rule: 0.0,
          num_sessions_with_non_consecutive_repeated_rule: 0.0,
          num_first_attempt_optimal: 0,
          num_first_attempt_not_optimal: 1
  }.stringify_keys,
  @prompt2.id => {
          prompt_id: @prompt2.id,
          total_responses: 1,
          session_count: 1,
          display_name: @prompt2.text,
          num_final_attempt_optimal: 1,
          num_final_attempt_not_optimal: 0,
          avg_attempts: 1,
          num_sessions_with_consecutive_repeated_rule: 0.0,
          num_sessions_with_non_consecutive_repeated_rule: 0.0,
          num_first_attempt_optimal: 1,
          num_first_attempt_not_optimal: 0
  }.stringify_keys
      })
    end
  end
end
