# frozen_string_literal: true

require 'jwt'

class CreateLessonsToken

  def initialize(user, classroom_unit_id)
    @user = user
    @classroom_unit_id = classroom_unit_id
  end

  def call
    create_token
  end

  attr_reader :user, :classroom_unit_id
  private :user
  private :classroom_unit_id

  private def create_token
    JWT.encode(payload, private_key, 'RS256')
  end

  private def payload
    {
      data: data,
      exp: exp
    }
  end

  private def exp
    Time.current.to_i + (365 * 24 * 3600)
  end

  private def data
    {
      user_id:               user_id,
      role:                  user_role,
      classroom_unit_id: classroom_unit_id
    }
  end

  private def user_id
    if user.present?
      user.id
    else
      ''
    end
  end

  private def user_role
    if user.present?
      user.role
    else
      'anonymous'
    end
  end

  private def classroom_unit_id
    if valid_classroom_unit?
      classroom_unit.id
    else
      ''
    end
  end

  private def valid_classroom_unit?
    classroom_unit.present? && (student_assigned? || teachers_activity?)
  end

  private def student_assigned?
    classroom_unit.assigned_student_ids.include? user_id
  end

  private def teachers_activity?
    classroom_unit&.classroom&.teachers&.pluck(:id)&.include? user_id
  end

  private def classroom_unit
    @classroom_unit ||= ClassroomUnit.find_by(id: @classroom_unit_id)
  end

  private def private_key
    @private_key ||= OpenSSL::PKey::RSA.new(ENV['LESSONS_PRIVATE_KEY'])
  end
end
