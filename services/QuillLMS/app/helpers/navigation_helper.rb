# frozen_string_literal: true

module NavigationHelper
  include Rails.application.routes.url_helpers

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
  LEARNING_TOOLS_TAB = { name: LEARNING_TOOLS, url: '/tools/connect', id: 'learning-tools' }
  LOGIN_TAB = { name: LOG_IN, url: '/session/new' }
  LOGOUT_TAB = { name: LOG_OUT, url: '/session', id: 'logout-tab' }
  QUILL_SUPPORT_TAB = { name: QUILL_SUPPORT, url: 'https://support.quill.org/', id: 'quill-support-tab' }
  SIGN_UP_TAB = { name: SIGN_UP, url: '/account/new' }
  STUDENT_CENTER_TAB = { name: STUDENT_CENTER, url: '/student-center' }
  TEACHER_CENTER_TAB = { name: TEACHER_CENTER, url: '/teacher-center' }

  # tertiary navigation tabs
  ACTIVITY_ANALYSIS_TAB = { name: ACTIVITY_ANALYSIS, url: '/teachers/progress_reports/diagnostic_reports/#/activity_packs', id: 'mobile-activity-analysis-tab' }

  ADMIN_ACCESS_TAB = { name: ADMIN_ACCESS, url: '/admin_access' }
  DIAGNOSTICS_TAB = { name: DIAGNOSTICS, url: '/teachers/progress_reports/diagnostic_reports/#/diagnostics', id: 'mobile-diagnostics-tab' }

  UNAUTHED_USER_TABS = [LEARNING_TOOLS_TAB, EXPLORE_CURRICULUM_TAB, TEACHER_CENTER_TAB, ABOUT_US_TAB, LOGIN_TAB, SIGN_UP_TAB]
  STUDENT_TABS = [LEARNING_TOOLS_TAB, STUDENT_CENTER_TAB, QUILL_SUPPORT_TAB, LOGOUT_TAB]

  ACTIVE_TAB_PATHS = {
    LEARNING_TOOLS => ['tools'],
    ABOUT_US => ['about', 'announcements', 'mission', 'impact', 'press', 'team', 'pathways', 'careers', 'contact'],
    EXPLORE_CURRICULUM => ['activities/', 'ap', 'preap', 'springboard'],
    TEACHER_CENTER => ['teacher-center', 'faq'],
    STUDENT_CENTER => ['student-center']
  }

  ACTIVE_DASHBOARD_TAB_PATHS = {
    OVERVIEW => ['dashboard'],
    MY_ACCOUNT => ['my_account', 'subscriptions', 'admin_access'],
    ASSIGN_ACTIVITIES => ['assign'],
    MY_ACTIVITIES => ['teachers/classrooms/activity_planner'],
    MY_REPORTS => ['progress_reports', 'scorebook'],
    MY_CLASSES => ['teachers/classrooms'],
    TEACHER_PREMIUM => ['teacher_premium'],
    PREMIUM_HUB => ['premium_hub'],
    PREMIUM => ['premium'],
    QUILL_ACADEMY => ['quill_academy']
  }

  ACTIVE_SUBTAB_PATHS = {
    OVERVIEW => ['teachers/classrooms/dashboard'],
    MY_ACCOUNT => ['teachers/my_account'],
    MY_SUBSCRIPTIONS => ['subscriptions'],
    ADMIN_ACCESS => ['admin_access'],
    ARCHIVED_CLASSES => ['teachers/classrooms/archived'],
    ACTIVITY_SUMMARY => ['teachers/classrooms/scorebook'],
    ACTIVE_CLASSES => ['teachers/classrooms'],
    ACTIVITY_ANALYSIS => ['teachers/progress_reports/diagnostic_reports'],
    DIAGNOSTICS => ['teachers/progress_reports/diagnostic_reports'],
    ACTIVITY_SCORES => ['teachers/progress_reports/activities_scores_by_classroom', 'teachers/progress_reports/student_overview'],
    CONCEPTS => ['teachers/progress_reports/concepts/students'],
    STANDARDS => ['teachers/progress_reports/standards/classrooms'],
    DATA_EXPORT => ['teachers/progress_reports/activity_sessions']
  }

  def active_classes_tab
    @active_classes_tab ||= { name: ACTIVE_CLASSES, url: teachers_classrooms_path }
  end

  def activity_scores_tab
    @activity_scores_tab ||= { name: ACTIVITY_SCORES, url: teachers_progress_reports_activities_scores_by_classroom_path }
  end

  def activity_summary_tab
    @activity_summary_tab ||= { name: ACTIVITY_SUMMARY, url: scorebook_teachers_classrooms_path }
  end

  def archived_classes_tab
    @archived_classes_tab ||= { name: ARCHIVED_CLASSES, url: archived_teachers_classrooms_path }
  end

  def concepts_tab
    @concepts_tab ||= { name: CONCEPTS, url: teachers_progress_reports_concepts_students_path }
  end

  def data_export_tab
    @data_export_tab ||= { name: DATA_EXPORT, url: teachers_progress_reports_activity_sessions_path }
  end

  def home_tab
    @home_tab ||= { name: HOME, url: root_path }
  end

  def my_account_tab
    @my_account_tab ||= { name: MY_ACCOUNT, url: teachers_my_account_path, id: 'my-account-tab' }
  end

  def my_activities_tab
    @my_activities_tab ||= { name: MY_ACTIVITIES, url: lesson_planner_teachers_classrooms_path }
  end

  def my_classes_tab
    @my_classes_tab ||= { name: MY_CLASSES, url: teachers_classrooms_path }
  end

  def my_reports_tab
    @my_reports_tab ||= { name: MY_REPORTS, url: teachers_progress_reports_landing_page_path }
  end

  def my_subscriptions_tab
    @my_subscriptions_tab ||= { name: MY_SUBSCRIPTIONS, url: subscriptions_path }
  end

  def overview_tab
    @overview_tab ||= { name: OVERVIEW, url: dashboard_teachers_classrooms_path }
  end

  def premium_hub_tab
    @premium_hub_tab ||= { name: PREMIUM_HUB, url: teachers_premium_hub_path, id: 'admin-tab' }
  end

  def premium_tab
    @premium_tab ||= { name: PREMIUM, url: premium_path, id: 'premium-tab' }
  end

  def quill_academy_tab
    @quill_academy_tab ||= { name: QUILL_ACADEMY, url: quill_academy_path, id: 'quill-academy-tab' }
  end

  def standards_tab
    @standards_tab ||= { name: STANDARDS, url: teachers_progress_reports_standards_classrooms_path }
  end

  def teacher_premium_tab
    @teacher_premium_tab ||= { name: TEACHER_PREMIUM, url: teacher_premium_path, id: 'premium-tab' }
  end

  def common_authed_user_tabs
    @common_authed_user_tabs ||= [LEARNING_TOOLS_TAB, TEACHER_CENTER_TAB, QUILL_SUPPORT_TAB, my_account_tab, LOGOUT_TAB]
  end

  def home_page_active?
    ['dashboard', 'my_account', 'teacher_guide', 'google_sync'].include?(action_name) ||
      (controller_name == 'subscriptions' && action_name == 'index') ||
      controller_name == 'referrals' ||
      controller_name == 'admin_access'
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

  def premium_tab_copy(current_user)
    middle_diamond_img = "<div class='large-diamond-icon is-in-middle'></div>"
    end_diamond_img = "<div class='large-diamond-icon'></div>"
    case current_user&.premium_state
    when TRIAL
      "<span>Premium</span>#{middle_diamond_img}<span>#{current_user.trial_days_remaining} Days Left</span>"
    when LOCKED
      current_user.last_expired_subscription&.is_trial? ? "<span>Premium</span>#{middle_diamond_img}<span>Trial Expired</span>" : "<span>Premium</span>#{middle_diamond_img}<span>Expired</span>"
    when NONE, nil
      "<span>Explore Premium</span>#{end_diamond_img}"
    end
  end

  def determine_premium_badge(current_user)
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

  def admin_tab_access?(current_user)
    !!(current_user.teacher? && !current_user.admin? && current_user.school && School::ALTERNATIVE_SCHOOL_NAMES.exclude?(current_user.school.name))
  end

  # this is a duplicate of the QuillAuthentication method, used here because we can't import it directly
  def admin_impersonating_user?(user)
    session[:admin_id].present? && session[:admin_id] != user.id
  end

  def determine_active_tab(current_path)
    ACTIVE_TAB_PATHS.each do |tab, paths|
      return tab if paths.any? { |path| current_path.include?(path) }
    end

    determine_dashboard_active_tab(current_path)
  end

  def determine_active_subtab(current_path)
    ACTIVE_SUBTAB_PATHS.each do |tab, paths|
      # since the Activity Analysis and Diagnostics routes are handled by the frontend and we don't have access to the hash path from the backend,
      #  we just return a space that will be detected and overridden by the frontend
      return ' ' if current_path == 'teachers/progress_reports/diagnostic_reports'

      return tab if paths.any? { |path| current_path.include?(path) }
    end

    nil
  end

  def determine_premium_class(current_path)
    if ['premium_hub', 'quill_academy'].any? { |str| current_path.include?(str) }
      'red'
    elsif current_path.include?('premium')
      'yellow'
    end
  end

  def determine_mobile_navbar_tabs(current_user)
    return UNAUTHED_USER_TABS if !current_user

    return STUDENT_TABS if current_user.student?

    authed_user_tabs(current_user)
  end

  def mobile_subnav_tabs(current_user)
    if home_page_active?
      home_page_subnav_tabs(current_user)
    elsif classes_page_active?
      [active_classes_tab, archived_classes_tab]
    elsif student_reports_page_active?
      [
        activity_summary_tab,
        ACTIVITY_ANALYSIS_TAB,
        DIAGNOSTICS_TAB,
        activity_scores_tab,
        concepts_tab,
        standards_tab,
        data_export_tab
      ]
    end
  end

  private def overview_tab_access?
    current_user.has_classrooms? || current_user.archived_classrooms.any? || current_user.coteacher_invitations.any?
  end

  private def home_page_subnav_tabs(current_user)
    tabs = [my_account_tab, my_subscriptions_tab]

    tabs.unshift(overview_tab) if overview_tab_access?
    tabs.push(ADMIN_ACCESS_TAB) if admin_tab_access?(current_user)
    tabs
  end

  private def determine_dashboard_active_tab(current_path)
    ACTIVE_DASHBOARD_TAB_PATHS.each do |tab, paths|
      return tab if paths.any? { |path| current_path.include?(path) }
    end

    HOME
  end

  private def authed_user_tabs(current_user)
    tabs = [
      home_tab,
      overview_tab,
      my_classes_tab,
      ASSIGN_ACTIVITIES_TAB,
      my_activities_tab,
      my_reports_tab
    ]

    tabs.push(premium_tab) unless current_user.premium_state == 'paid' || current_user.should_render_teacher_premium?
    tabs.push(teacher_premium_tab) if current_user.should_render_teacher_premium?
    tabs.push(premium_hub_tab) if current_user.admin? && !admin_impersonating_user?(current_user)
    tabs.push(quill_academy_tab)
    tabs.concat(common_authed_user_tabs)
  end
end
