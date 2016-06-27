class Teachers::ClassroomManagerController < ApplicationController
  respond_to :json, :html
  before_filter :teacher!
  before_filter :authorize!
  include ScorebookHelper

  def lesson_planner
    if current_user.classrooms_i_teach.empty?
      redirect_to new_teachers_classroom_path
    else
      @tab = params[:tab] #|| "manageUnits"
      @grade = params[:grade]
      @students = current_user.students.any?
      @last_classroom_name = current_user.classrooms_i_teach.last.name
      @last_classroom_id = current_user.classrooms_i_teach.last.id
    end
  end


  def generic_add_students
    if current_user && current_user.role == 'teacher'
      @classroom = current_user.classrooms_i_teach.first
      redirect_to teachers_classroom_invite_students_path(@classroom)
    else redirect_to profile_path
    end
  end

  def retrieve_classrooms_for_assigning_activities # in response to ajax request
    current_user.classrooms_i_teach.includes(:students).each do |classroom|
      obj = {
        classroom: classroom,
        students: classroom.students.sort_by(&:sorting_name)
      }
      ( @classrooms_and_their_students ||= [] ).push obj
    end
    render json: {
      classrooms_and_their_students: @classrooms_and_their_students
    }
  end

  def invite_students
    @classrooms = current_user.classrooms_i_teach
  end

  def manage_archived_classrooms
    render "student_teacher_shared/archived_classroom_manager"
  end

  def archived_classroom_manager_data
    begin
    active = current_user.classrooms_i_teach
      .map(&:archived_classrooms_manager)
    inactive = Classroom.unscoped
      .where(teacher_id: current_user.id, visible: false)
      .map(&:archived_classrooms_manager)
    rescue NoMethodError => exception
      render json: {error: "No classrooms yet!"}, status: 400
    else
      render json: {active: active, inactive: inactive}
    end
  end

  def scorebook
    cr_id = params[:classroom_id] ? params[:classroom_id] : current_user.classrooms_i_teach.last.id
    classroom = Classroom.find(cr_id)
    @selected_classroom = {name: classroom.name, value: classroom.id, id: classroom.id}
    if current_user.classrooms_i_teach.empty?
      redirect_to new_teachers_classroom_path
    end

    if current_user.students.empty?
      if current_user.classrooms_i_teach.last.activities.empty?
        redirect_to(controller: "teachers/classroom_manager", action: "lesson_planner", tab: "exploreActivityPacks", grade: current_user.classrooms_i_teach.last.grade)
      else
        redirect_to teachers_classroom_invite_students_path(current_user.classrooms_i_teach.first)
      end
    end
  end

  def dashboard
    if current_user.classrooms_i_teach.empty?
      redirect_to new_teachers_classroom_path
    end
  end



  def premium
    @subscription_type = current_user.premium_state
    render json: {
      hasPremium: @subscription_type,
      trial_days_remaining: current_user.trial_days_remaining,
      first_day_of_premium_or_trial: current_user.premium_updated_or_created_today?
    }
  end

  def classroom_mini
    current_user.classrooms_i_teach.includes(:students).each do |classroom|
      obj = {
        classroom: classroom,
        students: classroom.students.count,
        activities_completed: classroom.activity_sessions.where(state: "finished").count
      }
      ( @classrooms ||= [] ).push obj
    end
    render json: {
      classes: @classrooms
    }
  end

  def dashboard_query
    @query_results = Dashboard.queries(current_user)
    render json: {
      performanceQuery: @query_results
    }
  end

  def teacher_guide
    @checkbox_data = {
      completed: current_user.checkboxes.map(&:objective_id),
      potential: Objective.all
    }
  end

  def getting_started
    @checkbox_data = current_user.getting_started_info
    render json: @checkbox_data
  end

  def scores
    classrooms = current_user.classrooms_i_teach.includes(classroom_activities: [:unit])
    units = classrooms.map(&:classroom_activities).flatten.map(&:unit).uniq.compact
    selected_classroom =  Classroom.find_by id: params[:classroom_id]
    scores, is_last_page = current_user.scorebook_scores params[:current_page].to_i, selected_classroom.try(:id), params[:unit_id], params[:begin_date], params[:end_date]
    render json: {
      teacher: Scorebook::TeacherSerializer.new(current_user).as_json(root: false),
      classrooms: classrooms,
      units: units,
      scores: scores,
      is_last_page: is_last_page,
      selected_classroom: selected_classroom
    }
  end

  # needed to simply render a page, lets React.js do the rest
  def my_account
  end

  def my_account_data
    render json: current_user.generate_teacher_account_info
  end

  def update_my_account

    # incoming request

    # var data = {
    #   name: this.state.name,
    #   username: this.state.username,
    #   email: this.state.email,
    #   password: this.state.password,
    #   password_confirmation: this.state.passwordConfirmation,
    #   school_id: this.state.selectedSchool.id,
    #   school_options_do_not_apply: this.state.schoolOptionsDoNotApply
    # }

    response = current_user.update_teacher params
    render json: response
  end

  def delete_my_account
    sign_out
    User.find(params[:id]).destroy
    render json: {}
  end

  private

  def authorize!
    if current_user.classrooms_i_teach.any?
      if params[:classroom_id].present? and params[:classroom_id].length > 0
        @classroom = Classroom.find(params[:classroom_id])
      end

      @classroom ||= current_user.classrooms_i_teach.first
      auth_failed unless @classroom.teacher == current_user
    end
  end
end
