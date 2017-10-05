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
        archived_units_with_shared_name_attr = archived_units.map do |u|
          unit_obj = u.attributes
          if Unit.find_by(user_id: u['user_id'], name: u['name'])
            unit_obj['shared_name'] = true
          else
            unit_obj['shared_name'] = false
          end
          unit_obj
        end
        render json: {archived_units: archived_units_with_shared_name_attr}
      else
        render json: {error: 'This user has no archived units.'}
      end
    end
  end

  def unarchive_units
    unit_ids = params['unit_ids']
    params['changed_names'].each do |id, name|
      Unit.unscoped.where(id: id).first.update_attribute('name', name)
    end
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
      unit_ids = classroom_activities.map(&:unit_id)
      Unit.unscoped.where(visible: false, id: unit_ids).update_all(visible: true)
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
            TeacherFixes::merge_activity_sessions(account1, account2)
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

  def move_student_from_one_class_to_another
    account_identifier = params['student_identifier']
    user = User.find_by_username_or_email(account_identifier)
    if user
      if user.role == 'student'
        classroom_1 = Classroom.find_by_code(params['class_code_1'])
        classroom_2 = Classroom.find_by_code(params['class_code_2'])
        if classroom_1 && classroom_2
          if classroom_1.teacher_id == classroom_2.teacher_id
            if StudentsClassrooms.find_by(student_id: user.id, classroom_id: classroom_1.id)
              StudentsClassrooms.find_or_create_by(student_id: user.id, classroom_id: classroom_2.id)
              TeacherFixes::move_activity_sessions(user.id, classroom_1.id, classroom_2.id)
              StudentsClassrooms.find_by(student_id: user.id, classroom_id: classroom_1.id).destroy
              render json: {}, status: 200
            else
              render json: {error: "#{account_identifier} is not in a classroom with the code #{params['class_code_1']}."}
            end
          else
            render json: {error: 'These classrooms do not have the same teacher.'}
          end
        else
          missing_class_code = classroom_1 ? params['class_code_2'] : params['class_code_1']
          render json: {error: "We cannot find a class with class code #{missing_class_code}."}
        end
      else
        render json: {error: "#{account_identifier} is not a student."}
      end
    else
      render json: {error: "We do not have an account for #{account_identifier}"}
    end
  end

  def google_unsync_account
    original_email = params['original_email']
    user = User.find_by_email(original_email)
    if user
      new_email = params['new_email']
      if new_email != ''
        user.update(email: new_email, password: params['password'], google_id: nil, signed_up_with_google: false)
      else
        user.update(password: params['password'], google_id: nil, signed_up_with_google: false)
      end
      if user.errors.any?
        render json: user.errors
      else
        render json: {}, status: 200
      end
    else
      render json: {error: "We do not have a user registered with the email #{original_email}"}
    end
  end

end
