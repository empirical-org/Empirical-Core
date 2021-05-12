require 'rails_helper'

RSpec.describe PromptFeedbackHistory, type: :model do
  before do
    # This is for CircleCI. Note that this refresh is NOT concurrent.
    ActiveRecord::Base.refresh_materialized_view('feedback_histories_grouped_by_rule_uid', false)
  end
  
  describe '#promptwise_sessions' do 
    it 'should aggregate rows correctly' do 
      main_activity = create(:activity)
      unused_activity = create(:activity)

      as1 = create(:activity_session, activity_id: main_activity.id)
      as2 = create(:activity_session, activity_id: main_activity.id)
      as3 = create(:activity_session, activity_id: unused_activity.id)

      f_h1 = create(:feedback_history, feedback_session_uid: as1.uid, attempt: 1, optimal: false, prompt_id: 1)
      f_h2 = create(:feedback_history, feedback_session_uid: as1.uid, attempt: 2, optimal: true, prompt_id: 1)
      f_h3 = create(:feedback_history, feedback_session_uid: as2.uid, attempt: 1, optimal: false, prompt_id: 2)
      f_h4 = create(:feedback_history, feedback_session_uid: as2.uid, attempt: 2, optimal: false, prompt_id: 2)
      f_h4 = create(:feedback_history, feedback_session_uid: as3.uid, prompt_id: 3)

      result = PromptFeedbackHistory.promptwise_sessions(main_activity.id)

      expect(result.count).to eq 2
      expect(result.first.at_least_one_optimal).to be true 
      expect(result.first.attempt_cardinal).to eq 2
      expect(result.last.at_least_one_optimal).to be false
      expect(result.last.attempt_cardinal).to eq 2
    end

  end

  describe '#promptwise_postprocessing' do 
    it 'should format' do 
      main_activity = create(:activity)
      unused_activity = create(:activity)

      p1 = Comprehension::Prompt.create!(
        id: 1,
        activity: main_activity,
        text: 'lorem ipsum1',
        conjunction: Comprehension::Prompt::CONJUNCTIONS.first,
        max_attempts: 5
      )

      p2 = Comprehension::Prompt.create!(
        id: 2,
        activity: main_activity,
        text: 'lorem ipsum2',
        conjunction: Comprehension::Prompt::CONJUNCTIONS.first,
        max_attempts: 5
      )

      as1 = create(:activity_session, activity_id: main_activity.id)
      as2 = create(:activity_session, activity_id: main_activity.id)
      as3 = create(:activity_session, activity_id: unused_activity.id)

      f_h1 = create(:feedback_history, feedback_session_uid: as1.uid, attempt: 1, optimal: false, prompt_id: 1)
      f_h2 = create(:feedback_history, feedback_session_uid: as1.uid, attempt: 2, optimal: true, prompt_id: 1)
      f_h3 = create(:feedback_history, feedback_session_uid: as2.uid, attempt: 1, optimal: false, prompt_id: 2)
      f_h4 = create(:feedback_history, feedback_session_uid: as2.uid, attempt: 2, optimal: false, prompt_id: 2)
      f_h4 = create(:feedback_history, feedback_session_uid: as3.uid, prompt_id: 3)

      result = PromptFeedbackHistory.promptwise_sessions(main_activity.id)
      processed = PromptFeedbackHistory.promptwise_postprocessing(result)
      expect(processed == {
        1 => {
          optimal_final_attempts: 1,
          session_count: 1,
          total_responses: 2,
          final_attempt_pct_optimal: 1.0,
          final_attempt_pct_not_optimal: 0.0,
          display_name: "lorem ipsum1"
        },
        2 => {
          optimal_final_attempts: 0,
          session_count: 1,
          total_responses: 2,
          final_attempt_pct_optimal: 0.0,
          final_attempt_pct_not_optimal: 1.0,
          display_name: "lorem ipsum2"
        }
      }).to be true

    end

  end

end
