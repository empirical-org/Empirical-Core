class TeacherFixController < ApplicationController
  include TeacherFixes
  before_filter :staff!

  def index
  end

  def get_archived_units
    user = User.find_by_username_or_email(params['teacher_identifier'])
    if !user
      render json: {error: 'No such user.'}
    elsif user.role != 'teacher'
      render json: {error: 'This user is not a teacher.'}
    else
      archived_units = Unit.unscoped.where(visible: false, user_id: user.id)
      if archived_units.any?
        render json: {archived_units: archived_units}
      else
        render json: {error: 'This user has no archived units.'}
      end
    end
  end

  def unarchive_units
    unit_ids = params['unit_ids']
    Unit.unscoped.where(id: unit_ids).update_all(visible: true)
    classroom_activities = ClassroomActivity.unscoped.where(unit_id: unit_ids)
    classroom_activities.update_all(visible: true)
    ActivitySession.unscoped.where(classroom_activity_id: classroom_activities.ids).update_all(visible: true)
    render json: {}, status: 200
  end

  def recover_classroom_activities
    classroom = Classroom.find_by_code(params['class_code'])
    if classroom
      classroom_activities = ClassroomActivity.unscoped.where(classroom_id: classroom.id)
      classroom_activities.update_all(visible: true)
      ActivitySession.unscoped.where(classroom_activity_id: classroom_activities.ids).update_all(visible: true)
      render json: {}, status: 200
    else
      render json: {error: 'No such classroom'}
    end
  end

  def merge_student_accounts
    account1 = User.find_by_username_or_email(params['account_1_identifier'])
    account2 = User.find_by_username_or_email(params['account_2_identifier'])
    if account1 && account2
      if account1.role === 'student' && account2.role === 'student'
        if TeacherFixes::same_classroom?(account1.id, account2.id)
          if account2.classrooms.length == 1
            TeacherFixes::merge_activity_sessions
            render json: {}, status: 200
          else
            render json: {error: "#{params['account_2_identifier']} is in more than one classroom."}
          end
        else
          render json: {error: "These students are not in the same classroom."}
        end
      else
        nonstudent_account_identifier = account1.role === 'student' ? params['account_2_identifier'] : params['account_1_identifier']
        render json: {error: "#{nonstudent_account_identifier} is not a student."}
      end
    else
      missing_account_identifier = account1 ? params['account_2_identifier'] : params['account_1_identifier']
      render json: {error: "We do not have an account for #{missing_account_identifier}"}
    end
  end


end
