# frozen_string_literal: true

module NavigationHelper
  def home_page_should_be_active?
    ['dashboard', 'my_account', 'teacher_guide', 'google_sync'].include?(action_name) || (controller_name == 'subscriptions' && action_name == 'index') || controller_name == 'referrals' || controller_name == 'admin_access'
  end

  def classes_page_should_be_active?
    (controller.class == Teachers::ClassroomsController ||
    controller_name == 'students' ||
    action_name == 'invite_students') &&
    controller.class.module_parent != Teachers::ProgressReports::Concepts
  end

  def assign_activity_page_should_be_active?
    controller.class == Teachers::ClassroomManagerController && action_name == 'assign'
  end

  def my_activities_page_should_be_active?
    controller.class == Teachers::ClassroomManagerController && action_name == 'lesson_planner'
  end

  def student_reports_page_should_be_active?
    controller.class == Teachers::ProgressReportsController ||
      controller.class.module_parent == Teachers::ProgressReports ||
      controller.class.module_parent == Teachers::ProgressReports::Standards ||
      controller.class.module_parent == Teachers::ProgressReports::Concepts ||
      action_name == 'scorebook'
  end

  def admin_page_should_be_active?
    action_name == 'admin_dashboard'
  end

  def premium_page_should_be_active?
    action_name == 'premium'
  end

  def quill_academy_should_be_active?
    action_name == 'quill_academy'
  end

  def premium_tab_copy
    middle_diamond_img = "<div class='nav-diamond-icon is-in-middle'></div>"
    end_diamond_img = "<div class='nav-diamond-icon'></div>"
    case current_user.premium_state
    when 'trial'
      "<span>Premium</span>#{middle_diamond_img}<span>#{current_user.trial_days_remaining} Days Left</span>"
    when 'locked'
      current_user.last_expired_subscription&.is_trial? ? "<span>Premium</span>#{middle_diamond_img}<span>Trial Expired</span>" : "<span>Premium</span>#{middle_diamond_img}<span>Expired</span>"
    when 'none', nil
      "<span>Explore Premium</span>#{end_diamond_img}"
    end
  end

  def determine_premium_badge
    return unless current_user
    premium_state = current_user.premium_state
    return unless premium_state == 'trial' || premium_state == 'paid'
    render_premium_badge
  end

  def render_premium_badge
    school = current_user.school
    district = school&.district
    if district&.subscription.present?
      "<div class='premium-navbar-badge-container'><span>District Premium</span><div class='diamond-icon'></div></div>"
    elsif school&.subscription.present?
      "<div class='premium-navbar-badge-container'><span>School Premium</span><div class='diamond-icon'></div></div>"
    else
      "<div class='premium-navbar-badge-container'><span>Teacher Premium</span><div class='diamond-icon'></div></div>"
    end
  end

  def in_assignment_flow?
    current_uri = request.env['PATH_INFO']
    current_uri&.match(%r{assign/.*}) != nil
  end

  def playing_activity?
    activity_actions = [
        ApplicationController::EVIDENCE,
        ApplicationController::PROOFREADER,
        ApplicationController::GRAMMAR,
        ApplicationController::LESSONS,
        ApplicationController::DIAGNOSTIC,
        ApplicationController::CONNECT
    ]
    controller.class == PagesController && activity_actions.include?(action_name)
  end

  def show_site_navigation?
    !in_assignment_flow?
  end

  # NOTE: subnavs for other pages are handled on the front end with React.
  def should_render_subnav?
    home_page_should_be_active? || classes_page_should_be_active? || student_reports_page_should_be_active?
  end

  def should_show_admin_access_tab?
    !!(current_user.teacher? && !current_user.admin? && current_user.school && School::ALTERNATIVE_SCHOOL_NAMES.exclude?(current_user.school.name))
  end

  # this is a duplicate of the QuillAuthentication method, used here because we can't import it directly
  def admin_impersonating_user?(user)
    session[:admin_id].present? && session[:admin_id] != user.id
  end
end
