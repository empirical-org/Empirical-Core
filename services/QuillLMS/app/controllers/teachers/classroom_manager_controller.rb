class Teachers::ClassroomManagerController < ApplicationController
  respond_to :json, :html
  before_filter :teacher_or_public_activity_packs
  # WARNING: these filter methods check against classroom_id, not id.
  before_filter :authorize_owner!, except: [:scores, :scorebook]
  before_filter :authorize_teacher!, only: [:scores, :scorebook]
  include ScorebookHelper

  def lesson_planner
    if current_user.classrooms_i_teach.empty?
      redirect_to new_teachers_classroom_path
    else
      set_classroom_variables
    end
  end

  def assign_activities
    if current_user.role != 'staff' && current_user.classrooms_i_teach.empty?
      redirect_to new_teachers_classroom_path
    else
      set_classroom_variables
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
    render json: classroom_with_students_json(current_user.classrooms_i_own)
  end

  def retrieve_classrooms_i_teach_for_custom_assigning_activities # in response to ajax request
    render json: classroom_with_students_json(current_user.classrooms_i_teach)
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
      classrooms = active_and_inactive_classrooms_hash
    rescue NoMethodError => exception
      render json: {error: "No classrooms yet!"}, status: 400
    else
      classrooms_i_own_that_have_coteachers = current_user.classrooms_i_own_that_have_coteachers
      render json: {
        active: classrooms[:active],
        active_classrooms_i_own: current_user.classrooms_i_own.map{|c| {label: c[:name], value: c[:id]}},
        inactive: classrooms[:inactive],
        coteachers: current_user.classrooms_i_own_that_have_coteachers,
        pending_coteachers: current_user.classrooms_i_own_that_have_pending_coteacher_invitations,
        my_name: current_user.name
      }
    end
  end

  def scorebook
    @classrooms = classrooms_with_data
    if params['classroom_id']
      @classroom = @classrooms.find{|classroom| classroom["id"] == params['classroom_id'].to_i}
    else
      @classroom = @classrooms.first
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
    scores = Scorebook::Query.run(params[:classroom_id], params[:current_page], params[:unit_id], params[:begin_date], params[:end_date], current_user.utc_offset)
    last_page = scores.length < 200
    render json: {
      scores: scores,
      is_last_page: last_page
    }
  end

  def my_account
    @time_zones = [{name: 'Select Time Zone', id: 'Select Time Zone'}].concat(TZInfo::Timezone.all_country_zone_identifiers.sort.map{|tz| {name: tz.gsub('_', ' '), id: tz}})
  end

  def my_account_data
    render json: current_user.generate_teacher_account_info
  end

  def update_my_account
    response = current_user.update_teacher params
    render json: response
  end

  def clear_data
    if params[:id] == current_user.id
      sign_out
      User.find(params[:id]).clear_data
      render json: {}
    end
  end

  def google_sync
  end

  def retrieve_google_classrooms
    google_response = GoogleIntegration::Classroom::Main.pull_data(current_user)
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
    GoogleStudentImporterWorker.perform_async(
      current_user.id,
      'Teachers::ClassroomManagerController'
    )
    render json: {}
  end

  private

  def set_classroom_variables
    @tab = params[:tab]
    @grade = params[:grade]
    @students = current_user.students.any?
    @last_classroom_name = current_user.classrooms_i_teach.last.name
    @last_classroom_id = current_user.classrooms_i_teach.last.id
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

end
