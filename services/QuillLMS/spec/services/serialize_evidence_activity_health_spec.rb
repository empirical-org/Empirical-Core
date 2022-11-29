# frozen_string_literal: true

require 'rails_helper'

describe 'SerializeEvidenceActivityHealth' do

  before do
    @activity = Evidence::Activity.create!(notes: 'Title_1', title: 'Title 1', parent_activity_id: 1, target_level: 1)
    @activity.update(flag: "production")
    @previous_version = @activity.version
    @activity.increment_version!

    @because_prompt1 = Evidence::Prompt.create!(activity: @activity, conjunction: 'because', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
    @but_prompt1 = Evidence::Prompt.create!(activity: @activity, conjunction: 'but', text: 'Some feedback text', max_attempts_feedback: 'Feedback')
    @so_prompt1 = Evidence::Prompt.create!(activity: @activity, conjunction: 'so', text: 'Some feedback text', max_attempts_feedback: 'Feedback')

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
    create(:feedback_history_flag, feedback_history: @first_session_feedback1, flag: FeedbackHistoryFlag::FLAG_REPEATED_RULE_CONSECUTIVE)
    create(:feedback_history_rating, user_id: @user.id, rating: true, feedback_history_id: @first_session_feedback3.id)
    create(:feedback_history_rating, user_id: @user.id, rating: false, feedback_history_id: @first_session_feedback4.id)
  end

  it 'gets the correct basic data for that activity' do
    data = SerializeEvidenceActivityHealth.new(@activity).data
    expect(data[:name]).to eq(@activity.title)
    expect(data[:flag]).to eq(@activity.flag.to_s)
    expect(data[:version]).to eq(@activity.version)
    expect(data[:activity_id]).to eq(@activity.id)
  end

  it 'gets the correct data for version plays' do
    data = SerializeEvidenceActivityHealth.new(@activity).data
    expect(data[:version_plays]).to eq(2)
  end

  it 'gets the correct data for total plays' do
    data = SerializeEvidenceActivityHealth.new(@activity).data
    expect(data[:total_plays]).to eq(3)
  end

  it 'gets the correct completion rate' do
    data = SerializeEvidenceActivityHealth.new(@activity).data
    expect(data[:completion_rate]).to eq(50)
  end

  it 'gets the correct because_final_optimal percent' do
    data = SerializeEvidenceActivityHealth.new(@activity).data
    expect(data[:because_final_optimal]).to eq(50)
  end

  it 'gets the correct but_final_optimal percent' do
    data = SerializeEvidenceActivityHealth.new(@activity).data
    expect(data[:but_final_optimal]).to eq(100)
  end

  it 'gets the correct so_final_optimal percent' do
    data = SerializeEvidenceActivityHealth.new(@activity).data
    expect(data[:so_final_optimal]).to eq(0)
  end

  it 'gets the correct average completion time' do
    data = SerializeEvidenceActivityHealth.new(@activity).data
    expect(data[:avg_completion_time]).to eq(400)
  end

  it 'returns nil for relevent columns if there are no feedback histories yet' do
    @activity.increment_version!
    data = SerializeEvidenceActivityHealth.new(@activity).data
    expect(data[:name]).to eq(@activity.title)
    expect(data[:flag]).to eq(@activity.flag.to_s)
    expect(data[:version]).to eq(@activity.version)
    expect(data[:activity_id]).to eq(@activity.id)
    expect(data[:version_plays]).to eq(0)
    expect(data[:total_plays]).to eq(3)
    expect(data[:completion_rate]).to eq(nil)
    expect(data[:because_final_optimal]).to eq(nil)
    expect(data[:but_final_optimal]).to eq(nil)
    expect(data[:so_final_optimal]).to eq(nil)
    expect(data[:avg_completion_time]).to eq(nil)
  end

end
