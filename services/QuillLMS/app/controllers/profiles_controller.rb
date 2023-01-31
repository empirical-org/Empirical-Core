# frozen_string_literal: true

class ProfilesController < ApplicationController
  before_action :signed_in!

  def show
    @user = current_user

    if current_user.student?
      @js_file = 'student'
      if current_user.classrooms.any?
        # in the future, we could use the following sql query to direct the student
        # to the classroom with the most recently updated classroom activity,
        # but it may not be worth the memory use now.
        # SELECT classroom_units.classroom_id FROM classroom_units
        # WHERE 1892827 = ANY(classroom_units.assigned_student_ids)
        # ORDER BY classroom_units.updated_at DESC
        # LIMIT 1
        redirect_to classes_path
      else
        redirect_to '/add_classroom'
      end
    else
      send current_user.role
    end
  end

  def user
    student
  end

  def student_profile_data
    if current_user.classrooms.any?
      render json: {
        scores: student_profile_data_sql(params[:current_classroom_id]),
        next_activity_session: next_activity_session,
        student: student_data,
        classroom_id: params[:current_classroom_id]
      }
    else
      render json: {error: 'Current user has no classrooms'}
    end
  end

  def mobile_profile_data
    if current_user.classrooms.any?
      grouped_scores = get_parsed_mobile_profile_data(params[:current_classroom_id])
      render json: {grouped_scores: grouped_scores}
    else
      render json: {error: 'Current user has no classrooms'}
    end
  end

  def students_classrooms_json
    render json: {classrooms: students_classrooms_with_join_info}
  end

  def admin
    return redirect_to dashboard_teachers_classrooms_path if admin_impersonating_user?(@user)

    redirect_to teachers_admin_dashboard_path
  end

  def teacher
    redirect_to dashboard_teachers_classrooms_path
  end

  def staff
    render :staff
  end

  protected def user_params
    params.require(:user).permit(:classcode, :email, :name, :username, :password)
  end

  protected def student_data
    {
      name: current_user&.name,
      classroom: {
        name: @current_classroom&.name,
        id: @current_classroom&.id,
        teacher: {
          name: @current_classroom&.owner&.name
        }
      },
    }
  end

  protected def students_classrooms_with_join_info
    RawSqlRunner.execute(
      <<-SQL
        SELECT
          classrooms.name AS name,
          teacher.name AS teacher,
          classrooms.id AS id
        FROM classrooms
        JOIN students_classrooms AS sc
          ON sc.classroom_id = classrooms.id
        JOIN classrooms_teachers
          ON classrooms_teachers.classroom_id = sc.classroom_id
          AND classrooms_teachers.role = 'owner'
        JOIN users AS teacher
          ON teacher.id = classrooms_teachers.user_id
        WHERE sc.student_id = #{current_user.id}
          AND classrooms.visible = true
          AND sc.visible = true
        ORDER BY sc.created_at DESC
      SQL
    ).to_a
  end

  protected def student_profile_data_sql(classroom_id=nil)
    @current_classroom = current_classroom(classroom_id)
    if @current_classroom && current_user
      @act_sesh_records = UnitActivity.get_classroom_user_profile(@current_classroom.id, current_user.id)
    else
      @act_sesh_records = []
    end
  end

  protected def next_activity_session
    # We only need to check the first activity session record here because of
    # the order in which the the query returns these.
    can_display_next_activity = begin
      @act_sesh_records.any? &&
      @act_sesh_records.first['locked'] == false &&
      @act_sesh_records.first['marked_complete'] == false &&
      !@act_sesh_records.first['max_percentage']
    end

    return unless can_display_next_activity

    @act_sesh_records.first
  end

  protected def get_parsed_mobile_profile_data(classroom_id)
    # classroom = current_classroom(classroom_id)
    Profile::Mobile::ActivitySessionsByUnit.new.query(current_user, classroom_id)
  end

  protected def current_classroom(classroom_id = nil)
    if classroom_id
      current_user.classrooms.find_by(id: classroom_id.to_i) if !!classroom_id
    else
      current_user.classrooms.last
    end
  end
end
