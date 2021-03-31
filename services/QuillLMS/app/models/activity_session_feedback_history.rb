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
class ActivitySessionFeedbackHistory < ActiveRecord::Base
  has_one :activity_session, foreign_key: :uid, primary_key: :activity_session_uid
  has_many :feedback_history, foreign_key: :activity_session_uid, primary_key: :feedback_history_session_uid

  validates :activity_session_uid, presence: true, uniqueness: true
  validates :feedback_history_session_uid, presence: true, uniqueness: true

  def serializable_hash(options = nil)
    options ||= {}

    super(options.reverse_merge(
      only: [:id, :activity_session_uid, :feedback_history_session_uid]
    ))
  end

  def self.get_feedback_history_session_uid(activity_session_uid)
    data = find_or_create_by(activity_session_uid: activity_session_uid) do |m|
      # In theory, SecureRandom.uuid should contain so much entropy that it's always
      # unique, but just in case, we'll re-generate new codes up to 5 times.
      begin
        retries ||= 0
        m.feedback_history_session_uid = SecureRandom.uuid
        m.save!
      rescue
        retry if (retries += 1) < 5
        raise
      end
    end
    data.feedback_history_session_uid
  end
end
