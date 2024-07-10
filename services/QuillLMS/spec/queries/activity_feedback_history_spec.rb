# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ActivityFeedbackHistory, type: :model do

  before do
    @main_activity = create(:evidence_activity, notes: 'Title_1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
    @prompt1 = create(:evidence_prompt, activity: @main_activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
  end

  describe '#activity_stats_query' do
    it 'should calculate average time spent as average_time_spent' do
      fh1 = create(:feedback_history, prompt: @prompt1)
      as1 = create(:activity_session, timespent: 500)
      fh1.feedback_session.update(activity_session_uid: as1.uid)
      fh2 = create(:feedback_history, prompt: @prompt1)
      as2 = create(:activity_session, timespent: 1000)
      fh2.feedback_session.update(activity_session_uid: as2.uid)
      fh3 = create(:feedback_history, prompt: @prompt1)
      as3 = create(:activity_session, timespent: 1500)
      fh3.feedback_session.update(activity_session_uid: as3.uid)

      result = ActivityFeedbackHistory.activity_stats_query(activity_id: @main_activity.id)

      expect(result[:average_time_spent]).to eq('16:40')
    end

    it 'should calculate average completion rate as average_completion_rate' do
      fh1 = create(:feedback_history, prompt: @prompt1)
      as1 = create(:activity_session, state: 'started')
      fh1.feedback_session.update(activity_session_uid: as1.uid)
      fh2 = create(:feedback_history, prompt: @prompt1)
      as2 = create(:activity_session, state: 'finished')
      fh2.feedback_session.update(activity_session_uid: as2.uid)
      fh3 = create(:feedback_history, prompt: @prompt1)
      as3 = create(:activity_session, state: 'finished')
      fh3.feedback_session.update(activity_session_uid: as3.uid)

      result = ActivityFeedbackHistory.activity_stats_query(activity_id: @main_activity.id)

      expect(result[:average_completion_rate]).to eq(66.67)
    end

    it 'should only capture the sessions for the designated activity version' do
      current_version = 2
      previous_version = 1

      fh1 = create(:feedback_history, prompt: @prompt1, activity_version: current_version)
      as1 = create(:activity_session, state: 'started')
      fh1.feedback_session.update(activity_session_uid: as1.uid)
      fh2 = create(:feedback_history, prompt: @prompt1, activity_version: current_version)
      as2 = create(:activity_session, state: 'finished')
      fh2.feedback_session.update(activity_session_uid: as2.uid)
      fh3 = create(:feedback_history, prompt: @prompt1, activity_version: previous_version)
      as3 = create(:activity_session, state: 'finished')
      fh3.feedback_session.update(activity_session_uid: as3.uid)

      result = ActivityFeedbackHistory.activity_stats_query(activity_id: @main_activity.id, activity_version: current_version)

      expect(result[:average_completion_rate]).to eq(50)
    end
  end
end
