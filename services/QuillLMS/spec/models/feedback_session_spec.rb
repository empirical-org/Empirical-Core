# == Schema Information
#
# Table name: feedback_sessions
#
#  id                   :integer          not null, primary key
#  activity_session_uid :string
#  uid                  :string
#
# Indexes
#
#  index_feedback_sessions_on_activity_session_uid  (activity_session_uid) UNIQUE
#  index_feedback_sessions_on_uid                   (uid) UNIQUE
#
require 'rails_helper'

# it { shoulda cheatsheet: https://github.com/thoughtbot/it { shoulda-matchers#activemodel-matchers
RSpec.describe FeedbackSession, type: :model do

  context 'associations' do
    it { should have_one(:activity_session) }
    it { should have_many(:feedback_history) }
  end

  context 'validations' do
    it { should validate_presence_of(:activity_session_uid) }
    it { should validate_uniqueness_of(:activity_session_uid) }
    it { should validate_presence_of(:uid) }
    it { should validate_uniqueness_of(:uid) }
  end

  context '#self.get_feedback_history_session_uid' do
    it 'should create a new record if the activity_session_uid is new' do
      expect(FeedbackSession.count).to eq(0)
      FeedbackSession.get_uid_for_activity_session(1)
      expect(FeedbackSession.count).to eq(1)
    end

    it 'should re-use an existing record if the activity_session_uid has been seen before' do
      FeedbackSession.get_uid_for_activity_session(1)
      expect(FeedbackSession.count).to eq(1)
      FeedbackSession.get_uid_for_activity_session(1)
      expect(FeedbackSession.count).to eq(1)
    end

    it 'should always return the same uuid for a given input' do
      result = FeedbackSession.get_uid_for_activity_session(1)
      expect(FeedbackSession.get_uid_for_activity_session(1)).to eq(result)
    end
  end
end

