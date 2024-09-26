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
  SCHOOLS_AND_DISTRICTS = 'Schools & Districts'
  LEARNING_TOOLS = 'Learning Tools'
  LOG_IN = 'Log In'
  LOG_OUT = 'Log Out'
  MY_ACCOUNT = 'My Account'
  MANAGE_ACTIVITIES = 'Manage Activities'
  MANAGE_CLASSES = 'Manage Classes'
  VIEW_REPORTS = 'View Reports'
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
  FOR_ADMINISTRATORS = 'For Administrators'
  PREMIUM_PRICING = 'Premium Pricing'
  CONCEPTS = 'Concepts'
  MY_SUBSCRIPTIONS = 'My Subscriptions'
  STANDARDS = 'Standards'
  SOCIAL_STUDIES_DASHBOARD = 'Social Studies Dashboard'
  SCIENCE_DASHBOARD = 'Science Dashboard'

  # primary/secondary navigation tabs
  ABOUT_US_TAB = { name: ABOUT_US, url: '/about' }
  ASSIGN_ACTIVITIES_TAB = { name: ASSIGN_ACTIVITIES, url: '/assign' }
  EXPLORE_CURRICULUM_TAB = { name: EXPLORE_CURRICULUM, url: '/activities/packs' }
  SCHOOLS_AND_DISTRICTS_TAB = { name: SCHOOLS_AND_DISTRICTS, url: '/admins', id: 'schools-and-districts' }
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

  UNAUTHED_USER_TABS = [SCHOOLS_AND_DISTRICTS_TAB, LEARNING_TOOLS_TAB, EXPLORE_CURRICULUM_TAB, TEACHER_CENTER_TAB, ABOUT_US_TAB, LOGIN_TAB, SIGN_UP_TAB]
  STUDENT_TABS = [SCHOOLS_AND_DISTRICTS_TAB, LEARNING_TOOLS_TAB, STUDENT_CENTER_TAB, QUILL_SUPPORT_TAB, LOGOUT_TAB]

  ACTIVE_TAB_PATHS = {
    SCHOOLS_AND_DISTRICTS => ['admins', /premium$/],
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
    MANAGE_ACTIVITIES => ['teachers/classrooms/activity_planner'],
    VIEW_REPORTS => ['progress_reports', 'scorebook'],
    MANAGE_CLASSES => ['teachers/classrooms'],
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

  def social_studies_dashboard_tab(current_user)
    return nil unless show_social_studies_dashboard_tab?(current_user)

    @social_studies_dashboard_tab ||= { name: SOCIAL_STUDIES_DASHBOARD, url: teachers_progress_reports_social_studies_world_history_1200_to_present_path }
  end

  def science_dashboard_tab(current_user)
    return nil unless show_science_dashboard_tab?(current_user)

    @science_dashboard_tab ||= { name: SCIENCE_DASHBOARD, url: teachers_progress_reports_interdisciplinary_science_building_ai_knowledge_path }
  end

  def home_tab
    @home_tab ||= { name: HOME, url: root_path }
  end

  def my_account_tab
    @my_account_tab ||= { name: MY_ACCOUNT, url: teachers_my_account_path, id: 'my-account-tab' }
  end

  def manage_activities_tab
    @manage_activities_tab ||= { name: MANAGE_ACTIVITIES, url: lesson_planner_teachers_classrooms_path }
  end

  def manage_classes_tab
    @manage_classes_tab ||= { name: MANAGE_CLASSES, url: teachers_classrooms_path }
  end

  def view_reports_tab
    @view_reports_tab ||= { name: VIEW_REPORTS, url: teachers_progress_reports_landing_page_path }
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

  def quill_academy_tab
    @quill_academy_tab ||= { name: QUILL_ACADEMY, url: quill_academy_path, id: 'quill-academy-tab' }
  end

  def standards_tab
    @standards_tab ||= { name: STANDARDS, url: teachers_progress_reports_standards_classrooms_path }
  end

  def common_authed_user_tabs
    @common_authed_user_tabs ||= [SCHOOLS_AND_DISTRICTS_TAB, LEARNING_TOOLS_TAB, TEACHER_CENTER_TAB, QUILL_SUPPORT_TAB, my_account_tab, LOGOUT_TAB]
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

  def manage_activities_page_active?
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

  def determine_premium_badge(current_user)
    return unless current_user&.teacher?

    case current_user.premium_state
    when TRIAL
      trial_badge(current_user)
    when LOCKED
      locked_badge(current_user)
    when nil, NONE
      explore_badge
    else
      teacher_or_district_badge(current_user)
    end
  end

  def in_assignment_flow?
    current_uri = request.env['PATH_INFO']
    current_uri&.match(%r{assign/.*}) != nil
  end

  def on_teacher_dashboard?
    ['assign', 'teachers', 'quill_academy'].any? { |path_fragment| request.env['PATH_INFO'].include?(path_fragment) }
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
    active_primary_tab = determine_active_primary_tab(current_path)
    return active_primary_tab if active_primary_tab

    determine_dashboard_active_tab(current_path)
  end

  def determine_active_primary_tab(current_path)
    ACTIVE_TAB_PATHS.each do |tab, paths|
      return tab if paths.any? { |path_fragment| current_path.match?(path_fragment) }
    end

    nil
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
        data_export_tab,
        social_studies_dashboard_tab(current_user),
        science_dashboard_tab(current_user)
      ].compact
    end
  end

  def show_social_studies_dashboard_tab?(current_user)
    unit_activities = current_user.unit_activities_for_classrooms_i_teach
    unit_activities_include_social_studies_activities?(unit_activities)
  end

  def show_science_dashboard_tab?(current_user)
    unit_activities = current_user.unit_activities_for_classrooms_i_teach
    unit_activities_include_science_activities?(unit_activities)
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
      manage_classes_tab,
      ASSIGN_ACTIVITIES_TAB,
      manage_activities_tab,
      view_reports_tab
    ]

    tabs.push(premium_hub_tab) if current_user.admin? && !admin_impersonating_user?(current_user)
    tabs.push(quill_academy_tab)
    tabs.concat(common_authed_user_tabs)
  end

  private def trial_badge(current_user)
    badge_html('EXPLORE PREMIUM', 'yellow') +
      badge_counter("#{pluralize(current_user.trial_days_remaining, 'day')} left")
  end

  private def locked_badge(current_user)
    badge_html('TEACHER PREMIUM', 'yellow') +
      badge_counter("#{current_user.last_expired_subscription&.is_trial? ? 'trial ' : ''}expired")
  end

  private def explore_badge
    badge_html('EXPLORE PREMIUM', 'yellow')
  end

  private def teacher_or_district_badge(current_user)
    if current_user.district_premium?
      badge_html('DISTRICT PREMIUM', 'red')
    elsif current_user.school_premium?
      badge_html('SCHOOL PREMIUM', 'red')
    else
      badge_html('TEACHER PREMIUM', 'yellow')
    end
  end

  private def badge_html(text, color)
    "<a class='premium-navbar-badge-container focus-on-light #{color}' href='/premium' rel='noopener noreferrer' target='_blank'>" \
    "<span class='premium-badge-text'>#{text}</span><div class='small-diamond-icon'></div></a>".html_safe
  end

  private def badge_counter(text)
    "<span class='premium-counter'>#{text}</span>".html_safe
  end

end
