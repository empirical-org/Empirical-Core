# frozen_string_literal: true

class TeachersController < ApplicationController
  around_action :force_writer_db_role, only: [:add_school]

  before_action :require_user, only: [:classrooms_i_teach_with_students, :classrooms_i_own_with_students]

  # Called when a teacher accepts an invite to the school. This is sent to them via email.
  def add_school
    if current_user.present? && current_user == User.find_by(id: params[:id])
      # Current user is the user that was invited.
      school = School.find(params[:school_id])
      # User should only belong to one school, so we find their existing link and update the school.
      school_user = SchoolsUsers.find_or_initialize_by(user_id: params[:id])
      school_user.school = school
      if school_user.save
        # redirect to profile with confirmation
        redirect_to profile_path, flash: {notice: "You have successfully joined #{school.name}."}
      else
        # redirect to profile with errors.
        redirect_to profile_path, flash: school_user.errors
      end
    else
      # User is not signed in or they are not the invitee, redirect to sign in page
      redirect_to new_session_path, flash: {error: "You must be signed in to add a school."}
    end
  end

  def admin_dashboard
    if current_user.present? && current_user.admin? && !admin_impersonating_user?(current_user)
      render 'admin'
    else
      redirect_to profile_path
    end
  end

  def current_user_json
    render json: current_user.to_json
  end

  def classrooms_i_teach_with_students
    render json: {classrooms: current_user.classrooms_i_teach_with_students}
  end

  def classrooms_i_own_with_students
    render json: {classrooms: current_user.classrooms_i_own_with_students}
  end

  def classrooms_i_teach_with_lessons
    if current_user.nil?
      render json: {classrooms: []} and return
    end

    classrooms = Classroom.joins(:activities, :classrooms_teachers)
      .where(unit_activities: {visible: true}, classroom_units: {visible: true},
        classrooms: {visible: true}, units: {visible: true})
      .where(classrooms_teachers: {user_id: current_user.id})
      .where(activities: {activity_classification_id: 6})
      .uniq

    render json: {classrooms: classrooms}
  end

  def update_current_user
    if current_user.update(teacher_params)
      render json: current_user, serializer: UserSerializer
    else
      render json: {errors: current_user.errors}, status: 400
    end
  end

  def completed_diagnostic_unit_info
    begin
      last_finished_diagnostic = current_user.finished_diagnostic_unit_ids_with_classroom_id_and_activity_id.first
      unit_info = { unit_id: last_finished_diagnostic.unit_id, classroom_id: last_finished_diagnostic.classroom_id, activity_id: last_finished_diagnostic.activity_id }
    rescue
      unit_info = {}
    end
    render json: {unit_info: unit_info}
  end

  def lessons_info_for_dashboard_mini
    return render json: { units: [] } if current_user.nil?

    lessons_activity_ids = ActivityClassification.lessons.activity_ids

    records =
      ClassroomsTeacher
        .select("classrooms.name AS classroom_name, activities.name AS activity_name, activities.supporting_info, activities.id AS activity_id, classroom_units.id AS classroom_unit_id, classrooms.id AS classroom_id")
        .joins("JOIN classrooms ON classrooms_teachers.classroom_id = classrooms.id AND classrooms.visible = TRUE AND classrooms_teachers.user_id = #{current_user.id}")
        .joins("JOIN classroom_units ON classroom_units.classroom_id = classrooms.id AND classroom_units.visible")
        .joins("JOIN unit_activities ON unit_activities.unit_id = classroom_units.unit_id AND unit_activities.activity_id IN (#{lessons_activity_ids.join(',')}) AND unit_activities.visible")
        .joins("JOIN activities ON unit_activities.activity_id = activities.id")
        .joins("JOIN classroom_unit_activity_states ON classroom_unit_activity_states.classroom_unit_id = classroom_units.id AND classroom_unit_activity_states.unit_activity_id = unit_activities.id AND completed = FALSE")
        .group("classrooms.name, activities.name, activities.id, activities.supporting_info, classroom_units.unit_id, classroom_units.id, classrooms.id, classroom_units.assigned_student_ids, classroom_units.created_at, unit_activities.created_at")
        .order(Arel.sql("greatest(classroom_units.created_at, unit_activities.created_at) DESC"))

    units = records.map do |r|
      {
        classroom_name: r['classroom_name'],
        activity_name: r['activity_name'],
        activity_id: r['activity_id'],
        classroom_unit_id: r['classroom_unit_id'],
        classroom_id: r['classroom_id'],
        supporting_info: r['supporting_info']
      }
    end

    render json: { units: units }
  end

  def diagnostic_info_for_dashboard_mini
    if current_user
      diagnostic_activity_ids = ActivityClassification.diagnostic.activity_ids
      records = ClassroomsTeacher.select("classrooms.name AS classroom_name, activities.name AS activity_name, activities.id AS activity_id, activities.follow_up_activity_id AS post_test_id, pre_test.id AS pre_test_id, classroom_units.unit_id AS unit_id, classrooms.id AS classroom_id, activity_sessions.count AS completed_count, array_length(classroom_units.assigned_student_ids, 1) AS assigned_count")
      .joins("JOIN classrooms ON classrooms_teachers.classroom_id = classrooms.id AND classrooms.visible = TRUE AND classrooms_teachers.user_id = #{current_user.id}")
      .joins("JOIN classroom_units ON classroom_units.classroom_id = classrooms.id AND classroom_units.visible")
      .joins("JOIN unit_activities ON unit_activities.unit_id = classroom_units.unit_id AND unit_activities.activity_id IN (#{diagnostic_activity_ids.join(',')}) AND unit_activities.visible")
      .joins("JOIN activities ON unit_activities.activity_id = activities.id")
      .joins("LEFT JOIN activities AS pre_test ON pre_test.follow_up_activity_id = activities.id")
      .joins("LEFT JOIN activity_sessions ON activity_sessions.activity_id = unit_activities.activity_id AND activity_sessions.classroom_unit_id = classroom_units.id AND activity_sessions.visible AND activity_sessions.is_final_score")
      .group("classrooms.name, activities.name, activities.id, activities.follow_up_activity_id, pre_test.id, classroom_units.unit_id, classrooms.id, classroom_units.assigned_student_ids, classroom_units.created_at, unit_activities.created_at")
      .order(Arel.sql("greatest(classroom_units.created_at, unit_activities.created_at) DESC"))
      units = records.map do |r|
        {
          assigned_count: r['assigned_count'] || 0,
          completed_count: r['completed_count'],
          classroom_name: r['classroom_name'],
          activity_name: r['activity_name'],
          activity_id: r['activity_id'],
          post_test_id: r['post_test_id'],
          pre_test_id: r['pre_test_id'],
          unit_id: r['unit_id'],
          classroom_id: r['classroom_id']
        }
      end
    else
      units = []
    end
    render json: { units: units }
  end

  private def teacher_params
    params.require(:teacher).permit(:admin_id, :first_name, :last_name, :email)
           .merge({role: User::TEACHER})

  end

end
