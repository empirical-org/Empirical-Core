# frozen_string_literal: true

require 'rails_helper'

describe InternalTool::EmailFeedbackHistorySessionDataWorker, type: :worker do
  let!(:user) { create(:user)}
  let!(:activity) { create(:evidence_activity) }
  let!(:because_prompt) { Evidence::Prompt.create!(activity: activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback') }
  let!(:but_prompt) { Evidence::Prompt.create!(activity: activity, conjunction: 'but', text: 'Some feedback text', max_attempts_feedback: 'Feedback') }
  let!(:so_prompt) { Evidence::Prompt.create!(activity: activity, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback') }
  let!(:activity_session1_uid) { SecureRandom.uuid }
  let!(:activity_session2_uid) { SecureRandom.uuid }
  let!(:feedback_history1) { create(:feedback_history, feedback_session_uid: activity_session1_uid, created_at: '2021-04-05T20:43:27.698Z', prompt_id: because_prompt.id) }
  let!(:feedback_history2) { create(:feedback_history, feedback_session_uid: activity_session1_uid, created_at: '2021-04-06T20:43:27.698Z', prompt_id: because_prompt.id) }
  let!(:feedback_history3) { create(:feedback_history, feedback_session_uid: activity_session1_uid, created_at: '2021-04-07T20:43:27.698Z', prompt_id: but_prompt.id) }
  let!(:feedback_history4) { create(:feedback_history, feedback_session_uid: activity_session1_uid, created_at: '2021-04-08T20:43:27.698Z', prompt_id: but_prompt.id) }
  let!(:feedback_history5) { create(:feedback_history, feedback_session_uid: activity_session1_uid, created_at: '2021-04-09T20:43:27.698Z', prompt_id: so_prompt.id) }
  let!(:feedback_history6) { create(:feedback_history, feedback_session_uid: activity_session1_uid, created_at: '2021-04-10T20:43:27.698Z', prompt_id: so_prompt.id) }
  let!(:feedback_history7) { create(:feedback_history, feedback_session_uid: activity_session2_uid, created_at: '2021-04-11T20:43:27.698Z', prompt_id: because_prompt.id) }


  describe 'called with only activity id' do

    before do
      allow(UserMailer).to receive(:feedback_history_session_csv_download).and_return(double(:email, deliver_now!: true))
    end

    it 'should fetch all feedback history sessions for that activity' do
      feedback_histories = FeedbackHistory.session_data_for_csv({activity_id: activity.id})
      results = []
      feedback_histories.find_each(batch_size: 10_000) { |feedback_history| results << feedback_history.serialize_csv_data }
      results.sort! { |a,b| b["datetime"] <=> a["datetime"] }

      expect(UserMailer).to receive(:feedback_history_session_csv_download).with("test@test.com", results)
      described_class.new.perform(activity.id, nil, nil, nil, nil, "test@test.com")
    end

    it 'should fetch all feedback history sessions for that activity and between designated dates' do
      start_date = '2021-04-06T20:43:27.698Z'
      end_date = '2021-04-08T20:43:27.698Z'
      feedback_histories = FeedbackHistory.session_data_for_csv({ activity_id: activity.id, start_date: start_date, end_date: end_date})
      results = []
      feedback_histories.find_each(batch_size: 10_000) { |feedback_history| results << feedback_history.serialize_csv_data }
      results.sort! { |a,b| b["datetime"] <=> a["datetime"] }

      expect(UserMailer).to receive(:feedback_history_session_csv_download).with("test@test.com", results)
      described_class.new.perform(activity.id, start_date, end_date, nil, nil, "test@test.com")
    end

    it 'should fetch all feedback history sessions for that activity that qualify for scoring' do
      feedback_histories = FeedbackHistory.session_data_for_csv({ activity_id: activity.id, responses_for_scoring: true})
      results = []
      feedback_histories.find_each(batch_size: 10_000) { |feedback_history| results << feedback_history.serialize_csv_data }
      results.sort! { |a,b| b["datetime"] <=> a["datetime"] }

      expect(UserMailer).to receive(:feedback_history_session_csv_download).with("test@test.com", results)
      described_class.new.perform(activity.id, nil, nil, nil, true, "test@test.com")
    end
  end
end
