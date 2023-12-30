# frozen_string_literal: true

require 'rails_helper'

describe PopulateEvidenceActivityHealthWorker do
  subject { described_class.new }

  before do
    @activity = create(:evidence_activity, notes: 'Title_1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
    @activity.update(flag: "production")
    @previous_version = @activity.version
    @activity.increment_version!

    @because_prompt1 = create(:evidence_prompt, activity: @activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
    @but_prompt1 = create(:evidence_prompt, activity: @activity, conjunction: 'but', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
    @so_prompt1 = create(:evidence_prompt, activity: @activity, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')

    @activity_session1 = create(:activity_session, state: "finished", timespent: 600)
    @activity_session2 = create(:activity_session, state: "finished", timespent: 300)
    @activity_session3 = create(:activity_session, state: "started", timespent: 200)
    @activity_session1_uid = @activity_session1.uid
    @feedback_session1_uid = FeedbackSession.get_uid_for_activity_session(@activity_session1_uid)
    @activity_session2_uid = @activity_session2.uid
    @feedback_session2_uid = FeedbackSession.get_uid_for_activity_session(@activity_session2_uid)
    @activity_session3_uid = @activity_session3.uid
    @feedback_session3_uid = FeedbackSession.get_uid_for_activity_session(@activity_session3_uid)
    @comprehension_turking_round = create(:comprehension_turking_round_activity_session, activity_session_uid: @activity_session1_uid)

    @user = create(:user)
    @first_session_feedback1 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, prompt_id: @because_prompt1.id, optimal: false, activity_version: @activity.version)
    @first_session_feedback2 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, prompt_id: @because_prompt1.id, attempt: 2, optimal: true, activity_version: @activity.version)
    @first_session_feedback3 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, prompt_id: @but_prompt1.id, optimal: true, activity_version: @activity.version)
    @first_session_feedback4 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, prompt_id: @so_prompt1.id, optimal: false, activity_version: @activity.version)
    @first_session_feedback5 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, prompt_id: @so_prompt1.id, attempt: 2, optimal: false, activity_version: @activity.version)
    @first_session_feedback6 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, prompt_id: @so_prompt1.id, attempt: 3, optimal: false, activity_version: @activity.version)
    @first_session_feedback7 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, prompt_id: @so_prompt1.id, attempt: 4, optimal: false, activity_version: @activity.version)
    @first_session_feedback8 = create(:feedback_history, feedback_session_uid: @activity_session1_uid, prompt_id: @so_prompt1.id, attempt: 5, optimal: false, activity_version: @activity.version)
    @second_session_feedback = create(:feedback_history, feedback_session_uid: @activity_session2_uid, prompt_id: @because_prompt1.id, optimal: true, activity_version: @previous_version)
    create(:feedback_history, feedback_session_uid: @activity_session2_uid, prompt_id: @because_prompt1.id, attempt: 2, optimal: false, activity_version: @previous_version)
    @third_session_feedback = create(:feedback_history, feedback_session_uid: @activity_session3_uid, prompt_id: @because_prompt1.id, attempt: 1, optimal: false, activity_version: @activity.version)
    create(:feedback_history, feedback_session_uid: @activity_session3_uid, prompt_id: @because_prompt1.id, attempt: 2, optimal: false, activity_version: @activity.version)
    create(:feedback_history, feedback_session_uid: @activity_session3_uid, prompt_id: @because_prompt1.id, attempt: 3, optimal: false, activity_version: @activity.version)
    create(:feedback_history, feedback_session_uid: @activity_session3_uid, prompt_id: @because_prompt1.id, attempt: 4, optimal: false, activity_version: @activity.version)
    create(:feedback_history, feedback_session_uid: @activity_session3_uid, prompt_id: @because_prompt1.id, attempt: 5, optimal: false, activity_version: @activity.version)
    create(:feedback_history_flag, feedback_history: @first_session_feedback1, flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_CONSECUTIVE)
    create(:feedback_history_rating, user_id: @user.id, rating: true, feedback_history_id: @first_session_feedback3.id)
    create(:feedback_history_rating, user_id: @user.id, rating: false, feedback_history_id: @first_session_feedback4.id)
  end

  describe '#perform' do
    it 'should create a new Evidence Activity Health object' do
      subject.perform(@activity.id)
      expect(Evidence::ActivityHealth.count).to eq(1)
      activity_health = Evidence::ActivityHealth.first
      expect(activity_health.name).to eq(@activity.title)
      expect(activity_health.flag).to eq(@activity.flag.to_s)
      expect(activity_health.version).to eq(@activity.version)
      expect(activity_health.activity_id).to eq(@activity.id)
      expect(activity_health.version_plays).to eq(2)
      expect(activity_health.total_plays).to eq(3)
      expect(activity_health.completion_rate).to eq(50)
      expect(activity_health.because_final_optimal).to eq(50)
      expect(activity_health.but_final_optimal).to eq(100)
      expect(activity_health.so_final_optimal).to eq(0)
      expect(activity_health.avg_completion_time).to eq(400)
    end

    it 'should destroy an existing Evidence Activity Health object for the same Evidence Activity' do
      existing_activity_health = Evidence::ActivityHealth.create(
        name: @activity.title,
        flag: @activity.flag.to_s,
        version: @activity.version,
        activity_id: @activity.id,
        version_plays: 0,
        total_plays: 0
      )
      expect { subject.perform(@activity.id) }.to change { Evidence::ActivityHealth.exists?(existing_activity_health.id) }.to(false)
      expect(Evidence::ActivityHealth.count).to eq(1)
      new_activity_health = Evidence::ActivityHealth.first
      expect(new_activity_health.name).to eq(@activity.title)
      expect(new_activity_health.flag).to eq(@activity.flag.to_s)
      expect(new_activity_health.version).to eq(@activity.version)
      expect(new_activity_health.activity_id).to eq(@activity.id)
    end
  end
end
