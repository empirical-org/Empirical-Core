# frozen_string_literal: true

class Teachers::ClassroomManagerController < ApplicationController
  include CheckboxCallback
  include CleverAuthable
  include DiagnosticReports
  include ScorebookHelper

  respond_to :json, :html

  around_action :force_writer_db_role, only: [:assign, :dashboard, :lesson_planner]

  before_action :teacher_or_public_activity_packs, except: [:unset_preview_as_student, :unset_view_demo]
  # WARNING: these filter methods check against classroom_id, not id.
  before_action :authorize_owner!, except: [:scores, :scorebook, :lesson_planner, :preview_as_student, :unset_preview_as_student, :view_demo, :unset_view_demo, :activity_feed]
  before_action :authorize_teacher!, only: [:scores, :scorebook, :lesson_planner]
  before_action :set_alternative_schools, only: [:my_account, :update_my_account, :update_my_password]

  MY_ACCOUNT = 'my_account'
  ASSIGN = 'assign'

  def lesson_planner
    set_classroom_variables
  end

  def assign
    session[GOOGLE_REDIRECT] = request.env['PATH_INFO']
    session[CLEVER_REDIRECT] = request.env['PATH_INFO']
    set_classroom_variables
    set_banner_variables
    set_diagnostic_variables
    @clever_link = clever_link
    @number_of_activities_assigned = current_user.units.map(&:unit_activities).flatten.map(&:activity_id).uniq.size
    find_or_create_checkbox(Objective::EXPLORE_OUR_LIBRARY, current_user)
    return unless params[:tab] == 'diagnostic'

    find_or_create_checkbox(Objective::EXPLORE_OUR_DIAGNOSTICS, current_user)
  end

  def generic_add_students
    redirect_to teachers_classrooms_path
  end

  # in response to ajax request
  def retrieve_classrooms_for_assigning_activities
    render json: classroom_with_students_json(current_user.classrooms_i_own)
  end

  # in response to ajax request
  def retrieve_classrooms_i_teach_for_custom_assigning_activities
    render json: classroom_with_students_json(current_user.classrooms_i_teach)
  end

  def classrooms_and_classroom_units_for_activity_share
    unit_id = params["unit_id"]
    render json: {
      classrooms: classroom_with_students_json(current_user.classrooms_i_teach),
      classroom_units: ClassroomUnit.where(unit_id: unit_id)
    }
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

  # rubocop:disable Metrics/CyclomaticComplexity
  def dashboard
    if current_user.classrooms_i_teach.empty? && current_user.archived_classrooms.none? && !current_user.has_outstanding_coteacher_invitation? && current_user.schools_admins.any?
      redirect_to teachers_admin_dashboard_path
      end
    welcome_milestone = Milestone.find_by_name(Milestone::TYPES[:see_welcome_modal])
    @must_see_modal = !UserMilestone.find_by(milestone_id: welcome_milestone&.id, user_id: current_user&.id) && Unit.unscoped.find_by_user_id(current_user&.id).nil?
    @featured_blog_posts = BlogPost.where.not(featured_order_number: nil).order(:featured_order_number)
    if @must_see_modal && current_user && welcome_milestone
      UserMilestone.find_or_create_by(user_id: current_user.id, milestone_id: welcome_milestone.id)
    end

    @objective_checklist = generate_onboarding_checklist
    @first_name = current_user.first_name

    growth_diagnostic_promotion_card_milestone = Milestone.find_by_name(Milestone::TYPES[:acknowledge_growth_diagnostic_promotion_card])
    @show_diagnostic_promotion_card = !UserMilestone.find_by(milestone_id: growth_diagnostic_promotion_card_milestone&.id, user_id: current_user&.id) && (current_user.created_at < "2021-11-29".to_date || current_user&.unit_activities&.where(activity_id: Activity.diagnostic_activity_ids)&.any?)
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def students_list
    @classroom = current_user.classrooms_i_teach.find {|classroom| classroom.id == params[:id]&.to_i}
    last_name = "substring(users.name, '(?=\s).*')"
    render json: { students: @classroom&.students&.order(Arel.sql("#{last_name} asc, users.name asc")) }
  end

  def premium
    @subscription_type = current_user.premium_state
    render json: {
      hasPremium: @subscription_type,
      last_subscription_was_trial: current_user.last_expired_subscription&.is_trial?,
      trial_days_remaining: current_user.trial_days_remaining,
      first_day_of_premium_or_trial: current_user.premium_updated_or_created_today?
    }
  end

  def classroom_mini
    render json: { classes: current_user.classroom_minis_info}
  end

  def teacher_dashboard_metrics
    json = current_user.all_classrooms_cache(key: 'classroom_manager.teacher_dashboard_metrics') do
      TeacherDashboardMetrics.new(current_user).run
    end

    render json: json
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
    classroom = Classroom.find(params[:classroom_id])
    cache_groups = {
      unit: params[:unit_id],
      page: params[:current_page],
      begin: params[:begin_date],
      end: params[:end_date],
      offset: current_user.utc_offset
    }

    json = current_user.classroom_cache(classroom, key: 'classroom_manager.scores', groups: cache_groups) do
      scores = Scorebook::Query.run(params[:classroom_id], params[:current_page], params[:unit_id], params[:begin_date], params[:end_date], current_user.utc_offset)

      last_page = scores.length < 200

      {
        scores: scores,
        is_last_page: last_page
      }
    end

    render json: json
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
      current_user.update(password: params[:new_password])
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
    return unless params[:id]&.to_i == current_user.id

    sign_out
    User.find(params[:id]).clear_data
    render json: {}
  end

  def retrieve_google_classrooms
    serialized_google_classrooms = GoogleIntegration::TeacherClassroomsCache.read(current_user.id)
    if serialized_google_classrooms
      render json: JSON.parse(serialized_google_classrooms)
    else
      GoogleIntegration::RetrieveTeacherClassroomsWorker.perform_async(current_user.id)
      render json: { id: current_user.id, quill_retrieval_processing: true }
    end
  end

  def update_google_classrooms
    serialized_classrooms_data = { classrooms: params[:selected_classrooms] }.to_json

    GoogleIntegration::TeacherClassroomsData
      .new(current_user, serialized_classrooms_data)
      .each { |classroom_data| GoogleIntegration::ClassroomImporter.run(classroom_data) }

    GoogleIntegration::TeacherClassroomsCache.delete(current_user.id)
    GoogleIntegration::RetrieveTeacherClassroomsWorker.perform_async(current_user.id)
    render json: { classrooms: current_user.google_classrooms }.to_json
  end

  def import_google_students
    selected_classroom_ids = Classroom.where(id: params[:classroom_id] || params[:selected_classroom_ids]).ids
    GoogleIntegration::TeacherClassroomsCache.delete(current_user.id)
    GoogleStudentImporterWorker.perform_async(
      current_user.id,
      'Teachers::ClassroomManagerController',
      selected_classroom_ids
    )
    render json: { id: current_user.id }
  end

  def view_demo
    demo = User.find_by_email('hello+demoteacher@quill.org')
    return render json: {errors: "Demo Account does not exist"}, status: 422 if demo.nil?

    self.current_user_demo_id = demo.id
    redirect_to '/profile'
  end

  def unset_view_demo
    self.current_user_demo_id = nil
    return redirect_to params[:redirect] if params[:redirect]

    redirect_to '/profile'
  end

  def preview_as_student
    student = User.find_by_id(params[:student_id])
    if student && (student&.classrooms&.to_a & current_user&.classrooms_i_teach)&.any?
      Analyzer.new.track(current_user, SegmentIo::BackgroundEvents::VIEWED_AS_STUDENT)
      self.preview_student_id= params[:student_id]
    end
    redirect_to '/profile'
  end

  def unset_preview_as_student
    self.preview_student_id= nil
    return redirect_to params[:redirect] if params[:redirect]

    redirect_to '/profile'
  end

  def activity_feed
    render json: { data: TeacherActivityFeed.get(current_user.id) }
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  private def generate_onboarding_checklist
    Objective::ONBOARDING_CHECKLIST_NAMES.map do |name|
      objective = Objective.find_by_name(name)
      checkbox = Checkbox.find_by(objective: objective, user: current_user)

      # handles case where user has been using Quill since before we introduced the new objectives
      if objective && !checkbox && [Objective::EXPLORE_OUR_LIBRARY, Objective::EXPLORE_OUR_DIAGNOSTICS].include?(name) && current_user.units&.any?
        checkbox = Checkbox.create(objective: objective, user: current_user)
      end

      {
        name: name,
        checked: checkbox.present?,
        link: objective&.action_url
      }
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def set_classroom_variables
    @tab = params[:tab]
    @grade = params[:grade]
    @students = current_user.students.any?

    last_classroom = current_user.classrooms_i_teach.last

    return unless last_classroom

    @last_classroom_name = last_classroom.name
    @last_classroom_id = last_classroom.id
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  private def set_banner_variables
    acknowledge_diagnostic_banner_milestone = Milestone.find_by_name(Milestone::TYPES[:acknowledge_diagnostic_banner])
    acknowledge_evidence_banner_milestone = Milestone.find_by_name(Milestone::TYPES[:acknowledge_evidence_banner])
    acknowledge_lessons_banner_milestone = Milestone.find_by_name(Milestone::TYPES[:acknowledge_lessons_banner])
    dismiss_grade_level_warning_milestone = Milestone.find_by_name(Milestone::TYPES[:dismiss_grade_level_warning])
    diagnostic_ids = Activity.diagnostic_activity_ids
    @show_diagnostic_banner = !UserMilestone.find_by(milestone_id: acknowledge_diagnostic_banner_milestone&.id, user_id: current_user&.id) && current_user&.unit_activities&.where(activity_id: diagnostic_ids)&.none?
    @show_evidence_banner = !UserMilestone.find_by(milestone_id: acknowledge_evidence_banner_milestone&.id, user_id: current_user&.id) && current_user&.classroom_unit_activity_states&.where(completed: true)&.none?
    @show_lessons_banner = !UserMilestone.find_by(milestone_id: acknowledge_lessons_banner_milestone&.id, user_id: current_user&.id) && current_user&.classroom_unit_activity_states&.where(completed: true)&.none?
    @show_grade_level_warning = !UserMilestone.find_by(milestone_id: dismiss_grade_level_warning_milestone&.id, user_id: current_user&.id)
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  # rubocop:disable Metrics/CyclomaticComplexity
  def set_diagnostic_variables
    @assigned_pre_tests = Activity.where(id: Activity::PRE_TEST_DIAGNOSTIC_IDS).map do |act|
      pre_test_diagnostic_unit_ids = current_user&.unit_activities&.where(activity_id: act.id)&.map(&:unit_id) || []
      assigned_classroom_ids = ClassroomUnit.where(unit_id: pre_test_diagnostic_unit_ids)&.map(&:classroom_id) || []
      all_classrooms = current_user.classrooms_i_teach.map do |classroom|
        set_pre_test_activity_sessions_and_assigned_students(act.id, classroom.id)
        set_post_test_activity_sessions_and_assigned_students(act.follow_up_activity_id, classroom.id)
        {
          id: classroom.id,
          completed_pre_test_student_ids: @pre_test_activity_sessions.map(&:user_id),
          completed_post_test_student_ids: @post_test_activity_sessions.map(&:user_id)
        }
      end
      {
        id: act.id,
        post_test_id: act.follow_up_activity_id,
        assigned_classroom_ids: assigned_classroom_ids,
        all_classrooms: all_classrooms
      }
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def classroom_with_students_json(classrooms)
    { classrooms_and_their_students: classrooms.map { |classroom| classroom_json(classroom) } }
  end

  private def classroom_json(classroom)
    { classroom: classroom, students: classroom.students.sort_by(&:sorting_name) }
  end


  private def classrooms_with_data
    RawSqlRunner.execute(
      <<-SQL
        SELECT
          classrooms.id,
          classrooms.id AS value,
          classrooms.name
        FROM classrooms_teachers AS ct
        JOIN classrooms
          ON ct.classroom_id = classrooms.id
          AND classrooms.visible = true
        WHERE ct.user_id = #{current_user.id}
      SQL
    ).to_a
  end

  private def authorize_owner!
    return unless params[:classroom_id]

    classroom_owner!(params[:classroom_id])
  end

  private def authorize_teacher!
    return unless params[:classroom_id]

    classroom_teacher!(params[:classroom_id])
  end

  private def teacher_or_public_activity_packs
    if !current_user && request.path.include?('featured-activity-packs')
      if params[:category]
        redirect_to "/activities/packs?category=#{params[:category]}"
      elsif params[:activityPackId]
        redirect_to "/activities/packs/#{params[:activityPackId]}"
      elsif params[:grade]
        redirect_to "/activities/packs?grade=#{params[:grade]}"
      else
        redirect_to "/activities/packs"
      end
    else
      teacher_or_staff!
    end
  end

  private def set_alternative_schools
    @alternative_schools = School.where(name: School::ALTERNATIVE_SCHOOL_NAMES)
    @alternative_schools_name_map = School::ALTERNATIVE_SCHOOLS_DISPLAY_NAME_MAP
  end

end
