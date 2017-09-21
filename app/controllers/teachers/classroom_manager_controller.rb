class Teachers::ClassroomManagerController < ApplicationController
  respond_to :json, :html
  before_filter :teacher_or_public_activity_packs
  before_filter :authorize!
  include ScorebookHelper
  include LastActiveClassroom

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

  def assign_activities
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
      redirect_to invite_students_teachers_classrooms_path
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
    @user = current_user
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
    @classrooms = Classroom.where(teacher_id: current_user.id).select('classrooms.id, classrooms.id AS value, classrooms.name')
    if params['classroom_id']
      @classroom = @classrooms.find(params['classroom_id'])
    else
      @classroom = @classrooms.first
    end
    @classrooms = @classrooms.as_json
    @classroom = @classroom.as_json
  end

  def dashboard
    if current_user.classrooms_i_teach.empty? && current_user.archived_classrooms.none?
      redirect_to new_teachers_classroom_path
    end
    @firewall_test = true
  end


  def students_list
    @classroom = Classroom.find params[:id]
    last_name = "substring(users.name, '(?=\s).*')"
    render json: {students: @classroom.students.order("#{last_name} asc, users.name asc")}
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
    render json: { classes: current_user.get_classroom_minis_info}
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
    scores = Scorebook::Query.run(params[:classroom_id], params[:current_page], params[:unit_id], params[:begin_date], params[:end_date])
    last_page = scores.length < 200
    render json: {
      scores: scores,
      is_last_page: last_page
    }
  end

  # needed to simply render a page, lets React.js do the rest
  def my_account
  end

  def my_account_data
    render json: current_user.generate_teacher_account_info
  end

  def update_my_account
    response = current_user.update_teacher params
    render json: response
  end

  def clear_data
    sign_out
    User.find(params[:id]).clear_data
    render json: {}
  end

  def google_sync
    # renders the google sync jsx file
  end

  def retrieve_google_classrooms
    google_response = GoogleIntegration::Classroom::Main.pull_data(current_user, session[:google_access_token])
    data = google_response === 'UNAUTHENTICATED' ? {errors: google_response} : {classrooms: google_response}
    render json: data
  end

  def update_google_classrooms
    if current_user.google_classrooms.any?
      google_classroom_ids = JSON.parse(params[:selected_classrooms]).map{ |sc| sc["id"] }
      current_user.google_classrooms.each do |classy|
        if google_classroom_ids.exclude?(classy.google_classroom_id)
          classy.update(visible: false)
        end
      end
    end
    GoogleIntegration::Classroom::Creators::Classrooms.run(current_user, JSON.parse(params[:selected_classrooms], {:symbolize_names => true}))
    render json: { classrooms: current_user.google_classrooms }.to_json
  end

  def import_google_students
    GoogleStudentImporterWorker.perform_async(current_user.id, session[:google_access_token])
    render json: {}
  end

  private


  def authorize!
    if current_user.classrooms_i_teach.any?
      if params[:classroom_id].present? and params[:classroom_id].length > 0
        @classroom = Classroom.find(params[:classroom_id])
      end
      @classroom ||= Classroom.unscoped.find_by(teacher_id: current_user.id)
      auth_failed unless @classroom.teacher == current_user
    end
  end

  def teacher_or_public_activity_packs
    if !current_user && request.path.include?('featured-activity-packs')
      if params[:category]
        redirect_to "/activities/packs/category/#{params[:category]}"
      elsif params[:activityPackId]
        redirect_to "/activities/packs/#{params[:activityPackId]}"
      elsif params[:grade]
        redirect_to "/activities/packs/grade/#{params[:grade]}"
      else
        redirect_to "/activities/packs"
      end
    else
      teacher!
    end
  end

end
