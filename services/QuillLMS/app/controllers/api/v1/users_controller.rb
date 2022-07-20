# frozen_string_literal: true

class Api::V1::UsersController < Api::ApiController

  def index
    render json: { user: current_user }
  end

  def current_user_and_coteachers
    render json: {
      user: current_user,
      coteachers: coteachers
    }
  end

  def current_user_role
    render json: { role: current_user&.role }
  end

  def student_and_teacher_ids_for_session
    uid = params[:activity_session_uid]
    student_id = current_user&.student? && current_user.id
    teacher_id = ActivitySession.where(uid: uid).first&.classroom&.teacher_id
    render json: { student_id: student_id, teacher_id: teacher_id }
  end

  private def coteachers
    return [] unless current_user

    RawSqlRunner.execute(
      <<-SQL
        SELECT DISTINCT
          users.id,
          users.name
        FROM users
        JOIN classrooms_teachers AS a
          ON a.user_id = users.id
        JOIN classrooms_teachers AS b
          ON a.classroom_id = b.classroom_id
        WHERE b.user_id = #{current_user.id}
          AND NOT a.user_id = #{current_user.id}
      SQL
    ).to_a
  end
end
