require 'rails_helper'

# it { shoulda cheatsheet: https://github.com/thoughtbot/it { shoulda-matchers#activemodel-matchers
RSpec.describe SessionFeedbackHistory, type: :model do
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
      assert_equal SessionFeedbackHistory.list_by_activity_session.length, 2
    end

    it 'should sort newest first' do
      assert_equal SessionFeedbackHistory.list_by_activity_session[0].session_uid, @session2_uid
    end

    it 'should only return enough items as specified via page_size' do
      responses = SessionFeedbackHistory.list_by_activity_session(page_size: 1)
      assert_equal responses.length, 1
      assert_equal responses[0].session_uid, @session2_uid
    end

    it 'should skip pages when specified via page' do
      responses = SessionFeedbackHistory.list_by_activity_session(page: 2, page_size: 1)
      assert_equal responses.length, 1
      assert_equal responses[0].session_uid, @session1_uid
    end
  end

  context '#serialize_list_by_activity_session' do
    it 'should take the query from #list_by_activity_session and return a shaped payload' do
      responses = SessionFeedbackHistory.list_by_activity_session
      assert_equal SessionFeedbackHistory.serialize_list_by_activity_session(responses), [
        {
          session_uid: @session2_uid,
          start_date: @second_session_feedback.created_at.iso8601,
          activity_id: @activity2.id,
          because_attempts: 2,
          but_attempts: 0,
          so_attempts: 0,
          complete: false
        }, {
          session_uid: @session1_uid,
          start_date: @first_session_feedback1.created_at.iso8601,
          activity_id: @activity1.id,
          because_attempts: 2,
          but_attempts: 1,
          so_attempts: 3,
          complete: true
        }
      ]
    end
  end

  context '#serialize_detail_by_activity_session' do
    it 'should build the expeted payload' do
      payload = SessionFeedbackHistory.serialize_detail_by_activity_session(@session1_uid)

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
