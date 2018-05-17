require 'jwt'

class LessonsTokenCreator
  attr_reader :user, :activity_session_id

  def initialize(user, activity_session_id)
    @user = user
    @activity_session_id = activity_session_id
  end

  def create
    JWT.encode(payload, private_key, 'RS256')
  end

  private

  def user_id
    if user.present?
      user.id.to_s
    else
      'anonymous'
    end
  end

  def payload
    Hash.new.tap do |data|
      data[:user_id] = user_id
      if user.nil?
        data[:anonymous] = true
      else
        data[:staff]               = true                if user.staff?
        data[:admin]               = true                if user.admin?
        data[:teacher]             = true                if user.teacher?
        data[:student]             = true                if user.student?
        data[:activity_session_id] = activity_session.id if valid_activity_session?
      end
    end
  end

  def valid_activity_session?
    activity_session.present? && (student_assigned? || teachers_activity?)
  end

  def student_assigned?
    activity_session.classroom_activity.assigned_student_ids.includes? user_id
  end

  def teachers_activity?
    activity_session.user_id == user_id
  end

  def activity_session
    @activity_session ||= ActivitySession.find_by(id: activity_session_id)
  end

  def private_key
    @private_key ||= OpenSSL::PKey::RSA.new(ENV['LESSONS_PRIVATE_KEY'])
  end
end
