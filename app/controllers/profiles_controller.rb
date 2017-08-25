class ProfilesController < ApplicationController
  before_filter :signed_in!

  def show
    @user = current_user
    if current_user.role == 'student'
      @firewall_test = true
      @js_file = 'student'
      if current_user.classrooms.any?
        render 'student'
      else
        render 'students_classrooms/add_classroom'
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
      # get_student_profile_data(params[:current_classroom_id], params[:current_page].to_i)}}
      render json: {scores: student_profile_data_sql(params[:current_classroom_id]), student: student_data}
    else
      render json: {error: 'Current user has no classrooms'}
    end
  end

  def get_mobile_profile_data
    if current_user.classrooms.any?
      grouped_scores = get_parsed_mobile_profile_data(params[:current_classroom_id])
      render json: {grouped_scores: grouped_scores}
    else
      render json: {error: 'Current user has no classrooms'}
    end
  end

  def students_classrooms_json
    render json: {classrooms: current_user.classrooms.includes(:teacher)
      .sort_by { |c|
        c.students_classrooms.find_by_student_id(current_user.id).created_at
      }.map {|c| c.students_classrooms_json(current_user.id)}}
  end

  def teacher
    if @user.classrooms_i_teach.any? || @user.archived_classrooms.any?
      redirect_to dashboard_teachers_classrooms_path
    else
      redirect_to new_teachers_classroom_path
    end
  end

  def admin
    render :admin
  end

  def staff
    render :staff
  end

protected
  def user_params
    params.require(:user).permit(:classcode, :email, :name, :username, :password)
  end

  def student_data
    {
      name: current_user.name,
      classroom: {
        name: @current_classroom.name,
        id: @current_classroom.id,
        teacher: {
          name: @current_classroom.teacher.name
        }
      },
    }
  end


  def student_profile_data_sql(classroom_id=nil)
    @current_classroom = current_classroom(classroom_id)
    act_sesh_records = ActiveRecord::Base.connection.execute(
    "SELECT unit.name,
       activity.name,
       activity.description,
       activity.repeatable,
       activity.activity_classification_id,
       unit.id AS unit_id,
       unit.created_at AS unit_created_at,
       unit.name AS unit_name,
       ca.id AS ca_id,
       acts.activity_id,
       MAX(acts.updated_at) AS act_sesh_updated_at,
       ca.due_date,
       ca.created_at AS classroom_activity_created_at,
       MAX(acts.percentage) AS max_percentage,
       SUM(CASE WHEN acts.state = 'started' THEN 1 ELSE 0 END) AS resume_link
    -- include ca.locked and ca.pinned
    FROM activity_sessions AS acts
    JOIN classroom_activities AS ca ON ca.id = acts.classroom_activity_id
    JOIN units AS unit ON unit.id = ca.unit_id
    JOIN activities AS activity ON activity.id = ca.activity_id
    WHERE acts.user_id = #{current_user.id}
    AND ca.classroom_id = #{@current_classroom.id}
    GROUP BY ca.id, activity.name, activity.description, acts.activity_id,
            unit.name, unit.id, unit.created_at, unit_name, activity.repeatable,
            activity.activity_classification_id
            ").to_a
  end

  def get_student_profile_data(classroom_id, current_page)
    classroom = current_classroom(classroom_id)
    grouped_scores, is_last_page = Profile::Processor.new.query(current_user, current_page, classroom.id)
    # this grabs the first unfinished session from the top level unit
    next_activity_session = current_user.next_activity_session(grouped_scores)
    {student: {name: current_user.name, classroom: {name: classroom.name, id: classroom.id, teacher: {name: classroom.teacher.name}}},
     grouped_scores: grouped_scores, is_last_page: is_last_page, next_activity_session: Profile::StudentActivitySessionSerializer.new(next_activity_session, root: false)}
  end

  def get_parsed_mobile_profile_data(classroom_id)
    # classroom = current_classroom(classroom_id)
    Profile::Mobile::ActivitySessionsByUnit.new.query(current_user, classroom_id)
  end

  def current_classroom(classroom_id = nil)
    if !classroom_id
       current_user.classrooms.last
    else
      Classroom.find(classroom_id.to_i) if !!classroom_id
    end
  end
end
