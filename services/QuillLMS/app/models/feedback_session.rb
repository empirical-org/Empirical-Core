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
class FeedbackSession < ActiveRecord::Base
  has_one :activity_session, foreign_key: :uid, primary_key: :activity_session_uid
  has_many :feedback_history, foreign_key: :feedback_session_uid, primary_key: :uid

  validates :activity_session_uid, presence: true, uniqueness: true
  validates :uid, presence: true, uniqueness: true

  def serializable_hash(options = nil)
    options ||= {}

    super(options.reverse_merge(
      only: [:id, :activity_session_uid, :uid]
    ))
  end

  def self.get_uid_for_activity_session(activity_session_uid)
    find_or_create_by(activity_session_uid: activity_session_uid) do |item|
      item.uid = SecureRandom.uuid if !item.uid
    end.uid
  end
end
