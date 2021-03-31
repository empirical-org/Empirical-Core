# == Schema Information
#
# Table name: activity_session_feedback_histories
#
#  id                           :integer          not null, primary key
#  activity_session_uid         :string
#  feedback_history_session_uid :string
#
# Indexes
#
#  index_activity_sess_fb_histories_on_activity_session_uid  (activity_session_uid) UNIQUE
#  index_activity_sess_fb_histories_on_feedback_history_uid  (feedback_history_session_uid) UNIQUE
#
require 'rails_helper'

# it { shoulda cheatsheet: https://github.com/thoughtbot/it { shoulda-matchers#activemodel-matchers
RSpec.describe ActivitySessionFeedbackHistory, type: :model do

  context 'associations' do
    it { should have_one(:activity_session) }
    it { should have_many(:feedback_history) }
  end

  context 'validations' do
    it { should validate_presence_of(:activity_session_uid) }
    it { should validate_uniqueness_of(:activity_session_uid) }
    it { should validate_presence_of(:feedback_history_session_uid) }
    it { should validate_uniqueness_of(:feedback_history_session_uid) }
  end

  context '#self.get_feedback_history_session_uid' do
    it 'should create a new record if the activity_session_uid is new' do
      assert_equal ActivitySessionFeedbackHistory.count, 0
      ActivitySessionFeedbackHistory.get_feedback_history_session_uid(1)
      assert_equal ActivitySessionFeedbackHistory.count, 1
    end

    it 'should re-use an existing record if the activity_session_uid has been seen before' do
      ActivitySessionFeedbackHistory.get_feedback_history_session_uid(1)
      assert_equal ActivitySessionFeedbackHistory.count, 1
      ActivitySessionFeedbackHistory.get_feedback_history_session_uid(1)
      assert_equal ActivitySessionFeedbackHistory.count, 1
    end

    it 'should always return the same uuid for a given input' do
      result = ActivitySessionFeedbackHistory.get_feedback_history_session_uid(1)
      assert_equal ActivitySessionFeedbackHistory.get_feedback_history_session_uid(1), result
    end
  end
end

