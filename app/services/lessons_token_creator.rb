require 'jwt'

class LessonsTokenCreator
  attr_reader :user, :classroom_activity_id

  def initialize(user, classroom_activity_id)
    @user = user
    @classroom_activity_id = classroom_activity_id
  end

  def create
    JWT.encode(payload, private_key, 'RS256')
  end

  private

  def user_id
    if user.present?
      user.id
    else
      'anonymous'
    end
  end

  def payload
    @payload ||= Hash.new.tap do |data|
      data[:user_id]               = user_id
      data[:role]                  = user.role             if user.present?
      data[:classroom_activity_id] = classroom_activity.id if valid_classroom_activity?
    end
  end

  def valid_classroom_activity?
    classroom_activity.present? && (student_assigned? || teachers_activity?)
  end

  def student_assigned?
    classroom_activity.assigned_student_ids.include? user_id
  end

  def teachers_activity?
    classroom_activity.classroom.teachers.pluck(:id).include? user_id
  end

  def classroom_activity
    @classroom_activity ||= ClassroomActivity.find_by(id: classroom_activity_id)
  end

  def private_key
    @private_key ||= OpenSSL::PKey::RSA.new(ENV['LESSONS_PRIVATE_KEY'])
  end
end
