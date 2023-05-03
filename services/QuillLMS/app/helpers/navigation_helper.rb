# frozen_string_literal: true

module NavigationHelper
  routes = Rails.application.routes.url_helpers

  # premium tiers
  PAID = 'paid'
  TRIAL = 'trial'
  LOCKED = 'locked'
  NONE = 'none'

  # primary/secondary navigation
  ABOUT_US = 'About Us'
  ASSIGN_ACTIVITIES = 'Assign Activities'
  EXPLORE_CURRICULUM = 'Explore Curriculum'
  HOME = 'Home'
  LEARNING_TOOLS = 'Learning Tools'
  LOG_IN = 'Log In'
  LOG_OUT = 'Log Out'
  MY_ACCOUNT = 'My Account'
  MY_ACTIVITIES = 'My Activities'
  MY_CLASSES = 'My Classes'
  MY_REPORTS = 'My Reports'
  OVERVIEW = 'Overview'
  PREMIUM = 'Premium'
  PREMIUM_HUB = 'Premium Hub'
  QUILL_ACADEMY = 'Quill Academy'
  QUILL_SUPPORT = 'Quill Support'
  SIGN_UP = 'Sign Up'
  STUDENT_CENTER = 'Student Center'
  TEACHER_CENTER = 'Teacher Center'
  TEACHER_PREMIUM = 'Teacher Premium'

  # tertiary navigation
  ADMIN_ACCESS = 'Admin Access'
  ACTIVE_CLASSES = 'Active Classes'
  ACTIVITY_ANALYSIS = 'Activity Analysis'
  ACTIVITY_SCORES = 'Activity Scores'
  ACTIVITY_SUMMARY = 'Activity Summary'
  ARCHIVED_CLASSES = 'Archived Classes'
  DATA_EXPORT = 'Data Export'
  DIAGNOSTICS = 'Diagnostics'
  CONCEPTS = 'Concepts'
  MY_SUBSCRIPTIONS = 'My Subscriptions'
  STANDARDS = 'Standards'

  # primary/secondary navigation tabs
  ABOUT_US_TAB = { name: ABOUT_US, url: '/about' }
  ASSIGN_ACTIVITIES_TAB = { name: ASSIGN_ACTIVITIES, url: '/assign' }
  EXPLORE_CURRICULUM_TAB = { name: EXPLORE_CURRICULUM, url: '/activities/packs' }
  HOME_TAB = { name: HOME, url: '/' }
  LEARNING_TOOLS_TAB = { name: LEARNING_TOOLS, url: '/tools/connect', id: 'learning-tools' }
  LOGIN_TAB = { name: LOG_IN, url: '/session/new' }
  LOGOUT_TAB = { name: LOG_OUT, url: '/session', id: 'logout-tab' }
  MY_ACCOUNT_TAB = { name: MY_ACCOUNT, url: routes.teachers_my_account_path, id: 'my-account-tab' }
  MY_ACTIVITIES_TAB = { name: MY_ACTIVITIES, url: routes.lesson_planner_teachers_classrooms_path }
  MY_CLASSES_TAB = { name: MY_CLASSES, url: routes.teachers_classrooms_path }
  MY_REPORTS_TAB = { name: MY_REPORTS, url: routes.teachers_progress_reports_landing_page_path }
  OVERVIEW_TAB = { name: OVERVIEW, url: routes.dashboard_teachers_classrooms_path }
  PREMIUM_TAB = { name: PREMIUM, url: routes.premium_path, id: 'premium-tab' }
  PREMIUM_HUB_TAB = { name: PREMIUM_HUB, url: routes.teachers_premium_hub_path, id: 'admin-tab' }
  QUILL_ACADEMY_TAB = { name: QUILL_ACADEMY, url: routes.quill_academy_path, id: 'quill-academy-tab' }
  QUILL_SUPPORT_TAB = { name: QUILL_SUPPORT, url: 'https://support.quill.org/', id: 'quill-support-tab' }
  SIGN_UP_TAB = { name: SIGN_UP, url: '/account/new' }
  STUDENT_CENTER_TAB = { name: STUDENT_CENTER, url: '/student-center' }
  TEACHER_CENTER_TAB = { name: TEACHER_CENTER, url: '/teacher-center' }
  TEACHER_PREMIUM_TAB = { name: TEACHER_PREMIUM, url: routes.teacher_premium_path, id: 'premium-tab' }

  # tertiary navigation tabs
  ACTIVE_CLASSES_TAB = { name: ACTIVE_CLASSES, url: routes.teachers_classrooms_path }
  ACTIVITY_ANALYSIS_TAB = { name: ACTIVITY_ANALYSIS, url: '/teachers/progress_reports/diagnostic_reports/#/activity_packs', id: 'mobile-activity-analysis-tab' }
  ACTIVITY_SCORES_TAB = { name: ACTIVITY_SCORES, url: routes.teachers_progress_reports_activities_scores_by_classroom_path }
  ACTIVITY_SUMMARY_TAB = { name: ACTIVITY_SUMMARY, url: routes.scorebook_teachers_classrooms_path }
  ADMIN_ACCESS_TAB = { name: ADMIN_ACCESS, url: '/admin_access' }
  ARCHIVED_CLASSES_TAB = { name: ARCHIVED_CLASSES, url: routes.archived_teachers_classrooms_path }
  CONCEPTS_TAB = { name: CONCEPTS, url: routes.teachers_progress_reports_concepts_students_path }
  DATA_EXPORT_TAB = { name: DATA_EXPORT, url: routes.teachers_progress_reports_activity_sessions_path }
  DIAGNOSTICS_TAB = { name: DIAGNOSTICS, url: '/teachers/progress_reports/diagnostic_reports/#/diagnostics', id: 'mobile-diagnostics-tab' }
  MY_SUBSCRIPTIONS_TAB = { name: MY_SUBSCRIPTIONS, url: routes.subscriptions_path }
  STANDARDS_TAB = { name: STANDARDS, url: routes.teachers_progress_reports_standards_classrooms_path }

  UNAUTHED_USER_TABS = [LEARNING_TOOLS_TAB, EXPLORE_CURRICULUM_TAB, TEACHER_CENTER_TAB, ABOUT_US_TAB, LOGIN_TAB, SIGN_UP_TAB]
  STUDENT_TABS = [LEARNING_TOOLS_TAB, STUDENT_CENTER_TAB, QUILL_SUPPORT_TAB, LOGOUT_TAB]
  COMMON_AUTHED_USER_TABS = [LEARNING_TOOLS_TAB, TEACHER_CENTER_TAB, QUILL_SUPPORT_TAB, MY_ACCOUNT_TAB, LOGOUT_TAB]

  def home_page_active?
    ['dashboard', 'my_account', 'teacher_guide', 'google_sync'].include?(action_name) || (controller_name == 'subscriptions' && action_name == 'index') || controller_name == 'referrals' || controller_name == 'admin_access'
  end

  def classes_page_active?
    (controller.class == Teachers::ClassroomsController ||
    controller_name == 'students' ||
    action_name == 'invite_students') &&
    controller.class.module_parent != Teachers::ProgressReports::Concepts
  end

  def assign_activity_page_active?
    controller.class == Teachers::ClassroomManagerController && action_name == 'assign'
  end

  def my_activities_page_active?
    controller.class == Teachers::ClassroomManagerController && action_name == 'lesson_planner'
  end

  def student_reports_page_active?
    controller.class == Teachers::ProgressReportsController ||
      controller.class.module_parent == Teachers::ProgressReports ||
      controller.class.module_parent == Teachers::ProgressReports::Standards ||
      controller.class.module_parent == Teachers::ProgressReports::Concepts ||
      action_name == 'scorebook'
  end

  def admin_page_active?
    action_name == 'premium_hub'
  end

  def premium_page_active?
    action_name == 'premium'
  end

  def quill_academy_active?
    action_name == 'quill_academy'
  end

  def teacher_premium_active?
    action_name == 'teacher_premium'
  end

  def premium_tab_copy
    middle_diamond_img = "<div class='large-diamond-icon is-in-middle'></div>"
    end_diamond_img = "<div class='large-diamond-icon'></div>"
    case current_user.premium_state
    when TRIAL
      "<span>Premium</span>#{middle_diamond_img}<span>#{current_user.trial_days_remaining} Days Left</span>"
    when LOCKED
      current_user.last_expired_subscription&.is_trial? ? "<span>Premium</span>#{middle_diamond_img}<span>Trial Expired</span>" : "<span>Premium</span>#{middle_diamond_img}<span>Expired</span>"
    when NONE, nil
      "<span>Explore Premium</span>#{end_diamond_img}"
    end
  end

  def determine_premium_badge
    return unless current_user

    premium_state = current_user.premium_state
    return unless [PAID, TRIAL].include?(premium_state)

    if current_user.district_premium?
      "<a class='premium-navbar-badge-container focus-on-light red' href='/premium' rel='noopener noreferrer' target='_blank' ><span class='premium-badge-text'>DISTRICT PREMIUM</span><div class='small-diamond-icon'></div></a>".html_safe
    elsif current_user.school_premium?
      "<a class='premium-navbar-badge-container focus-on-light red' href='/premium' rel='noopener noreferrer' target='_blank' ><span class='premium-badge-text'>SCHOOL PREMIUM</span><div class='small-diamond-icon'></div></a>".html_safe
    else
      "<a class='premium-navbar-badge-container focus-on-light yellow' href='/premium' rel='noopener noreferrer' target='_blank' ><span class='premium-badge-text'>TEACHER PREMIUM</span><div class='small-diamond-icon'></div></a>".html_safe
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
    home_page_active? || classes_page_active? || student_reports_page_active?
  end

  def should_show_admin_access_tab?
    !!(current_user.teacher? && !current_user.admin? && current_user.school && School::ALTERNATIVE_SCHOOL_NAMES.exclude?(current_user.school.name))
  end

  # this is a duplicate of the QuillAuthentication method, used here because we can't import it directly
  def admin_impersonating_user?(user)
    session[:admin_id].present? && session[:admin_id] != user.id
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def determine_active_tab(current_path)
    if current_path.include?('tools')
      LEARNING_TOOLS
    elsif ['about', 'announcements', 'mission', 'impact', 'press', 'team', 'pathways', 'careers'].any? { |str| current_path.include?(str)}
      ABOUT_US
    # /activities/ is for the Featured Activities and ELA Standards sub pages of the Explore Curriculum section
    elsif ['/activities/', 'ap', 'preap', 'springboard'].any? { |str| current_path.include?(str)}
      EXPLORE_CURRICULUM
    elsif ['teacher-center', 'faq'].any? { |str| current_path.include?(str)}
      TEACHER_CENTER
    elsif current_path.include?('student-center')
      STUDENT_CENTER
    else
      determine_dashboard_active_tab(current_path)
    end
  end

  def determine_active_subtab(current_path)
    if current_path.include?('teachers/classrooms/dashboard')
      OVERVIEW
    elsif current_path.include?('teachers/my_account')
      MY_ACCOUNT
    elsif current_path.include?('subscriptions')
      MY_SUBSCRIPTIONS
    elsif current_path.include?('admin_access')
      ADMIN_ACCESS
    elsif current_path.include?('teachers/classrooms/archived')
      ARCHIVED_CLASSES
    elsif current_path.include?('teachers/classrooms/scorebook')
      ACTIVITY_SUMMARY
    elsif current_path.include?('/teachers/classrooms')
      ACTIVE_CLASSES
    elsif current_path.include?('/teachers/progress_reports/diagnostic_reports/#/activity_packs')
      ACTIVITY_ANALYSIS
    elsif current_path.include?('/teachers/progress_reports/diagnostic_reports/#/diagnostics')
      DIAGNOSTICS
    elsif current_path.include?('/teachers/progress_reports/activities_scores_by_classroom')
      ACTIVITY_SCORES
    elsif current_path.include?('/teachers/progress_reports/concepts/students')
      CONCEPTS
    elsif current_path.include?('/teachers/progress_reports/standards/classrooms')
      STANDARDS
    elsif current_path.include?('/teachers/progress_reports/activity_sessions')
      DATA_EXPORT
    else
      # default to active_tab
      nil
    end
  end

  def determine_premium_class(current_path)
    if ['premium_hub', 'quill_academy'].any? { |str| current_path.include?(str) }
      'red'
    elsif current_path.include?('premium')
      'yellow'
    end
  end

  def determine_mobile_navbar_tabs
    return UNAUTHED_USER_TABS if !current_user

    return STUDENT_TABS if current_user&.role == 'student'

    authed_user_tabs
  end

  def mobile_subnav_tabs
    if home_page_active?
      home_page_subnav_tabs
    elsif classes_page_active?
      [ACTIVE_CLASSES_TAB, ARCHIVED_CLASSES_TAB]
    elsif student_reports_page_active?
      [ACTIVITY_SUMMARY_TAB, ACTIVITY_ANALYSIS_TAB, DIAGNOSTICS_TAB, ACTIVITY_SCORES_TAB, CONCEPTS_TAB, STANDARDS_TAB, DATA_EXPORT_TAB]
    end
  end

  private def should_render_overview_tab?
    current_user.has_classrooms? || current_user.archived_classrooms.any? || current_user.coteacher_invitations.any?
  end

  private def home_page_subnav_tabs
    tabs = [MY_ACCOUNT_TAB, MY_SUBSCRIPTIONS_TAB]

    tabs.unshift(OVERVIEW_TAB) if should_render_overview_tab?
    tabs.push(ADMIN_ACCESS_TAB) if should_show_admin_access_tab?
    tabs
  end

  private def determine_dashboard_active_tab(current_path)
    if current_path.include?('dashboard')
      OVERVIEW
    elsif ['my_account', 'subscriptions', 'admin_access'].any? { |str| current_path.include?(str)}
      MY_ACCOUNT
    elsif current_path.include?('assign')
      ASSIGN_ACTIVITIES
    elsif current_path.include?('teachers/classrooms/activity_planner')
      MY_ACTIVITIES
    elsif ['progress_reports', 'scorebook'].any? { |str| current_path.include?(str)}
      MY_REPORTS
    elsif current_path.include?('teachers/classrooms')
      MY_CLASSES
    elsif current_path.include?('teacher_premium')
      TEACHER_PREMIUM
    elsif current_path.include?('premium_hub')
      PREMIUM_HUB
    elsif current_path.include?('premium')
      PREMIUM
    elsif current_path.include?('quill_academy')
      QUILL_ACADEMY
    else
      HOME
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def authed_user_tabs
    tabs = [HOME_TAB, OVERVIEW_TAB, MY_CLASSES_TAB, ASSIGN_ACTIVITIES_TAB, MY_ACTIVITIES_TAB, MY_REPORTS_TAB]

    tabs.push(PREMIUM_TAB) unless current_user.premium_state == 'paid' || current_user.should_render_teacher_premium?
    tabs.push(TEACHER_PREMIUM_TAB) if current_user.should_render_teacher_premium?
    tabs.push(PREMIUM_HUB_TAB) if current_user.admin? && !admin_impersonating_user?(current_user)
    tabs.push(QUILL_ACADEMY_TAB)
    tabs.concat(COMMON_AUTHED_USER_TABS)
  end
end
