# frozen_string_literal: true

module NavigationHelper
  def home_page_should_be_active?
    ['dashboard', 'my_account', 'teacher_guide', 'google_sync'].include?(action_name) || (controller_name == 'subscriptions' && action_name == 'index') || controller_name == 'referrals'
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
    # action_name == 'premium'
  end

  def premium_tab_copy
    star_img = "<img alt='' src='https://assets.quill.org/images/icons/star.svg'></img>"
    case current_user.premium_state
    when 'trial'
      "<span>Premium</span>  #{star_img} #{current_user.trial_days_remaining} <span>Days Left</span>"
    when 'locked'
      current_user.last_expired_subscription&.is_trial? ? "<span>Premium</span> #{star_img} <span>Trial Expired</span>" : "<span>Premium</span>  #{star_img} <span>Subscription Expired</span>"
    when 'none', nil
      "<span>Try Premium</span> #{star_img}"
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
end
