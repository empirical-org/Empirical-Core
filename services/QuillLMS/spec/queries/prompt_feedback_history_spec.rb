require 'rails_helper'

RSpec.describe PromptFeedbackHistory, type: :model do
  before do
    # This is for CircleCI. Note that this refresh is NOT concurrent.
    ActiveRecord::Base.refresh_materialized_view('feedback_histories_grouped_by_rule_uid', false)
  end
  
  describe '#promptwise_sessions' do 
    it 'should aggregate rows correctly' do 
      main_activity = Comprehension::Activity.create!(name: 'Title_1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
      unused_activity = Comprehension::Activity.create!(name: 'Title_2', title: 'Title 2', parent_activity_id: 2, target_level: 1)

      prompt1 = Comprehension::Prompt.create!(activity: main_activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      prompt2 = Comprehension::Prompt.create!(activity: main_activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
      prompt3 = Comprehension::Prompt.create!(activity: unused_activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')

      session_uid1 = SecureRandom.uuid
      session_uid2 = SecureRandom.uuid
      session_uid3 = SecureRandom.uuid

      f_h1 = create(:feedback_history, attempt: 1, optimal: false, prompt_id: prompt1.id, feedback_session_uid: session_uid1)
      f_h2 = create(:feedback_history, attempt: 2, optimal: true, prompt_id: prompt1.id, feedback_session_uid: session_uid1)
      f_h3 = create(:feedback_history, attempt: 1, optimal: false, prompt_id: prompt2.id, feedback_session_uid: session_uid2)
      f_h4 = create(:feedback_history, attempt: 2, optimal: false, prompt_id: prompt2.id, feedback_session_uid: session_uid2)
      f_h5 = create(:feedback_history, prompt_id: prompt3.id, feedback_session_uid: session_uid3)

      result = PromptFeedbackHistory.promptwise_sessions(main_activity.id)

      expect(result.count).to eq 2
      expect(result.first.at_least_one_optimal).to be true 
      expect(result.first.attempt_cardinal).to eq 2
      expect(result.last.at_least_one_optimal).to be false
      expect(result.last.attempt_cardinal).to eq 2
    end

  end

  describe '#has_consecutive_repeated_rule?' do 
    it 'should calculate correctly' do 
      expect( 
        PromptFeedbackHistory.has_consecutive_repeated_rule?([1,2,3,4], %w(a b c d))
      ).to eq false

      expect( 
        PromptFeedbackHistory.has_consecutive_repeated_rule?([], [])
      ).to eq false

      expect( 
        PromptFeedbackHistory.has_consecutive_repeated_rule?([1,2,3,4], %w(a b c c))
      ).to eq true

      expect( 
        PromptFeedbackHistory.has_consecutive_repeated_rule?([1,2,3,4,5], %w(a a b c c))
      ).to eq true
    end
  end

  describe '#has_non_consecutive_repeated_rule?' do 
    it 'should calculate correctly' do 
      expect( 
        PromptFeedbackHistory.has_non_consecutive_repeated_rule?([1,2,3,4], %w(a b c d))
      ).to eq false

      expect( 
        PromptFeedbackHistory.has_non_consecutive_repeated_rule?([1,2,3,4], %w(a b c a))
      ).to eq true
    end 

    it 'should ignore consecutive repeats' do 
      expect( 
        PromptFeedbackHistory.has_non_consecutive_repeated_rule?([1,2,3,4], %w(a a c d))
      ).to eq false

      expect( 
        PromptFeedbackHistory.has_non_consecutive_repeated_rule?([1,2,3,4], %w(a a a d))
      ).to eq false

      expect( 
        PromptFeedbackHistory.has_non_consecutive_repeated_rule?([1,2,3,4,5], %w(a a c d c))
      ).to eq true
    end
  end
  
  describe '#first_attempt_optimal?' do 
    it 'should return true' do 
      expect(
        PromptFeedbackHistory.first_attempt_optimal?([1], [true])
      ).to be true
      
      expect(
        PromptFeedbackHistory.first_attempt_optimal?([2, 1], [true, false])
      ).to be false
    end
  end

  describe '#promptwise_postprocessing' do 

    let(:main_activity) { create(:activity) }
    let(:unused_activity) { create(:activity) }

    let!(:p1) do
      Comprehension::Prompt.create!(
        id: 1,
        activity: main_activity,
        text: 'lorem ipsum1',
        conjunction: Comprehension::Prompt::CONJUNCTIONS.first,
        max_attempts: 5
      )
    end

    let!(:p2) do 
        Comprehension::Prompt.create!(
        id: 2,
        activity: main_activity,
        text: 'lorem ipsum2',
        conjunction: Comprehension::Prompt::CONJUNCTIONS.first,
        max_attempts: 5
        )
    end

    let!(:as1) { create(:activity_session, activity_id: main_activity.id) }
    let!(:as2) { create(:activity_session, activity_id: main_activity.id) }
    let!(:as3) { create(:activity_session, activity_id: unused_activity.id) }

    it 'should format' do 
      f_h1 = create(:feedback_history, feedback_session_uid: as1.uid, attempt: 1, optimal: false, prompt_id: 1)
      f_h2 = create(:feedback_history, feedback_session_uid: as1.uid, attempt: 2, optimal: true, prompt_id: 1)
      f_h3 = create(:feedback_history, feedback_session_uid: as2.uid, attempt: 1, optimal: false, prompt_id: 2)
      f_h4 = create(:feedback_history, feedback_session_uid: as2.uid, attempt: 2, optimal: false, prompt_id: 2)
      f_h5 = create(:feedback_history, feedback_session_uid: as3.uid, prompt_id: 3)

      result = PromptFeedbackHistory.promptwise_sessions(main_activity.id)
      processed = PromptFeedbackHistory.promptwise_postprocessing(result)

      first_prompt = processed[:"1"]
      second_prompt = processed[:"2"]

      expect(first_prompt).to include(
        {
          total_responses: 2.0,
          session_count: 1.0,
          display_name: "lorem ipsum1",

          pct_final_attempt_optimal: 1.0,
          pct_final_attempt_not_optimal: 0.0,

          avg_attempts_to_optimal: 2.0,

          pct_consecutive_repeated_attempts_for_same_rule: 0.0,
          pct_non_consecutive_repeated_attempts_for_same_rule: 0.0,

          pct_first_attempt_optimal: 0.0,
          pct_first_attempt_not_optimal: 1.0
        })
      expect(second_prompt).to include(
        {
          total_responses: 2.0,
          session_count: 1.0,
          display_name: "lorem ipsum2",

          pct_final_attempt_optimal: 0.0,
          pct_final_attempt_not_optimal: 1.0,

          avg_attempts_to_optimal: 0.0,

          pct_consecutive_repeated_attempts_for_same_rule: 0.0,
          pct_non_consecutive_repeated_attempts_for_same_rule: 0.0,

          pct_first_attempt_optimal: 0.0,
          pct_first_attempt_not_optimal: 1.0
        })
    end

    it 'should format consecutive repeated attempts' do 
      f_h1 = create(:feedback_history, feedback_session_uid: as1.uid, attempt: 1, optimal: false, prompt_id: 1, rule_uid: 1)
      f_h2 = create(:feedback_history, feedback_session_uid: as1.uid, attempt: 2, optimal: true, prompt_id: 1, rule_uid: 2)
      f_h3 = create(:feedback_history, feedback_session_uid: as2.uid, attempt: 1, optimal: false, prompt_id: 2, rule_uid: 1)
      f_h4 = create(:feedback_history, feedback_session_uid: as2.uid, attempt: 2, optimal: false, prompt_id: 2, rule_uid: 1)

      result = PromptFeedbackHistory.promptwise_sessions(main_activity.id)
      processed = PromptFeedbackHistory.promptwise_postprocessing(result)

      second_prompt = processed[:"2"]

      expect(second_prompt).to include(
        {
          pct_consecutive_repeated_attempts_for_same_rule: 1.0,
          pct_non_consecutive_repeated_attempts_for_same_rule: 0.0,

        })
    end

  end
end
