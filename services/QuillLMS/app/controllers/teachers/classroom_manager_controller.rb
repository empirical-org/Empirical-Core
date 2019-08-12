class Teachers::ClassroomManagerController < ApplicationController
  respond_to :json, :html
  before_filter :teacher_or_public_activity_packs
  # WARNING: these filter methods check against classroom_id, not id.
  before_filter :authorize_owner!, except: [:scores, :scorebook, :lesson_planner]
  before_filter :authorize_teacher!, only: [:scores, :scorebook, :lesson_planner]
  before_filter :set_alternative_schools, only: [:my_account, :update_my_account, :update_my_password]
  include ScorebookHelper

  MY_ACCOUNT = 'my_account'

  def lesson_planner
    if current_user.classrooms_i_teach.empty?
      redirect_to new_teachers_classroom_path
    else
      set_classroom_variables
    end
  end

  def assign_activities
    set_classroom_variables
  end

  def generic_add_students
    redirect_to teachers_classrooms_path
  end

  def retrieve_classrooms_for_assigning_activities # in response to ajax request
    render json: classroom_with_students_json(current_user.classrooms_i_own)
  end

  def retrieve_classrooms_i_teach_for_custom_assigning_activities # in response to ajax request
    render json: classroom_with_students_json(current_user.classrooms_i_teach)
  end

  def invite_students
    redirect_to teachers_classrooms_path
  end

  def scorebook
    @classrooms = classrooms_with_data
    if params['classroom_id']
      @classroom = @classrooms.find{|classroom| classroom["id"].to_i == params['classroom_id'].to_i}
    end
    @classrooms = @classrooms.as_json
    @classroom = @classroom.as_json
  end

  def dashboard
    if current_user.classrooms_i_teach.empty? && current_user.archived_classrooms.none? && !current_user.has_outstanding_coteacher_invitation?
      if current_user.schools_admins.any?
        redirect_to teachers_admin_dashboard_path
      else
        redirect_to new_teachers_classroom_path
      end
    end
    @firewall_test = true
  end

  def students_list
    @classroom = current_user.classrooms_i_teach.find {|classroom| classroom.id == params[:id]&.to_i}
    last_name = "substring(users.name, '(?=\s).*')"
    render json: {students: @classroom&.students&.order("#{last_name} asc, users.name asc")}
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
    scores = Scorebook::Query.run(params[:classroom_id], params[:current_page], params[:unit_id], params[:begin_date], params[:end_date], current_user.utc_offset)
    last_page = scores.length < 200
    render json: {
      scores: scores,
      is_last_page: last_page
    }
  end

  def my_account
    session[GOOGLE_REDIRECT] = request.env['PATH_INFO']
    session[:clever_redirect] = request.env['PATH_INFO']
    @google_or_clever_just_set = session[ApplicationController::GOOGLE_OR_CLEVER_JUST_SET]
    session[ApplicationController::GOOGLE_OR_CLEVER_JUST_SET] = nil
    @account_info = current_user.generate_teacher_account_info
  end

  def update_my_account
    # @TODO - refactor to replace the rails errors with the ones used here
    response = current_user.update_teacher(params['classroom_manager'])
    if response && response[:errors] && response[:errors].any?
      errors = response[:errors]
      render json: {errors: errors}, status: 422
    else
      render json: current_user.generate_teacher_account_info
    end
  end

  def update_my_password
    # @TODO - move to the model in an update_password method that uses validations and returns the user record with errors if it's not successful.
    errors = {}
    if current_user.authenticate(params[:current_password])
      if params[:new_password] == params[:confirmed_new_password]
        current_user.update(password: params[:new_password])
      else
        errors['confirmed_new_password'] = "Those passwords didn't match. Try again."
      end
    else
      errors['current_password'] = 'Wrong password. Try again or click Forgot password to reset it.'
    end
    if errors.any?
      render json: {errors: errors}, status: 422
    else
      render json: current_user.generate_teacher_account_info
    end
  end

  def clear_data
    if params[:id]&.to_i == current_user.id
      sign_out
      User.find(params[:id]).clear_data
      render json: {}
    end
  end

  def retrieve_google_classrooms
    google_response = GoogleIntegration::Classroom::Main.pull_data(current_user)
    data = google_response === 'UNAUTHENTICATED' ? {errors: google_response} : {classrooms: google_response}
    render json: data
  end

  def update_google_classrooms
    GoogleIntegration::Classroom::Creators::Classrooms.run(current_user, params[:selected_classrooms])
    render json: { classrooms: current_user.google_classrooms }.to_json
  end

  def import_google_students
    if params[:classroom_id]
      selected_classrooms = Classroom.where(id: params[:classroom_id])
    elsif params[:selected_classroom_ids]
      selected_classrooms = Classroom.where(id: params[:selected_classroom_ids])
    end
    GoogleStudentImporterWorker.perform_async(
      current_user.id,
      'Teachers::ClassroomManagerController',
      selected_classrooms
    )
    render json: {}
  end

  private

  def set_classroom_variables
    @tab = params[:tab]
    @grade = params[:grade]
    @students = current_user.students.any?

    last_classroom = current_user.classrooms_i_teach.last

    return unless last_classroom

    @last_classroom_name = last_classroom.name
    @last_classroom_id = last_classroom.id
  end


  def classroom_with_students_json(classrooms)
    {
        classrooms_and_their_students: classrooms.map { |classroom|
          classroom_json(classroom)
        }
    }
  end

  def classroom_json(classroom)
    {  classroom: classroom, students: classroom.students.sort_by(&:sorting_name)}
  end

  def invited_classrooms
    ActiveRecord::Base.connection.execute("
        SELECT coteacher_classroom_invitations.id AS classroom_invitation_id, users.name AS inviter_name, classrooms.name AS classroom_name, TRUE AS invitation
        FROM invitations
        JOIN coteacher_classroom_invitations ON coteacher_classroom_invitations.invitation_id = invitations.id
        JOIN users ON users.id = invitations.inviter_id
        JOIN classrooms ON classrooms.id = coteacher_classroom_invitations.classroom_id
        WHERE invitations.invitee_email = #{ActiveRecord::Base.sanitize(current_user.email)} AND invitations.archived = false;
      ").to_a
  end

  def active_and_inactive_classrooms_hash
    classrooms = {}
    classrooms[:active] = invited_classrooms
    classrooms[:inactive] = []
    ClassroomsTeacher.where(user_id: current_user.id).each do |classrooms_teacher|
      classroom = Classroom.unscoped.find(classrooms_teacher.classroom_id)
      if classroom.visible
        classrooms[:active] << classroom.archived_classrooms_manager
      else
        classrooms[:inactive] << classroom.archived_classrooms_manager
      end
    end
    classrooms
  end

  def classrooms_with_data
    ActiveRecord::Base.connection.execute(
      "SELECT classrooms.id, classrooms.id AS value, classrooms.name from classrooms_teachers AS ct
      JOIN classrooms ON ct.classroom_id = classrooms.id AND classrooms.visible = TRUE
      WHERE ct.user_id = #{current_user.id}"
    ).to_a
  end


  def authorize_owner!
    if params[:classroom_id]
      classroom_owner!(params[:classroom_id])
    end
  end

  def authorize_teacher!
    if params[:classroom_id]
      classroom_teacher!(params[:classroom_id])
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
      teacher_or_staff!
    end
  end

  def set_alternative_schools
    @alternative_schools = School.where(name: School::ALTERNATIVE_SCHOOL_NAMES)
    @alternative_schools_name_map = School::ALTERNATIVE_SCHOOLS_DISPLAY_NAME_MAP
  end

end
