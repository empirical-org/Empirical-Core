# frozen_string_literal: true

module NavbarHelper
  include Rails.application.routes.url_helpers

  LEARNING_TOOLS_TAB = { name: 'Learning Tools', url: '/tools/connect', id: 'learning-tools' }
  EXPLORE_CURRICULUM_TAB = { name: 'Explore Curriculum', url: '/activities/packs' }
  TEACHER_CENTER_TAB = { name: 'Teacher Center', url: '/teacher-center' }
  STUDENT_CENTER_TAB = { name: 'Student Center', url: '/student-center' }
  QUILL_SUPPORT_TAB = { name: 'Quill Support', url: 'https://support.quill.org/', id: 'quill-support-tab' }
  ABOUT_US_TAB = { name: 'About Us', url: '/about' }
  LOGIN_TAB = { name: 'Log In', url: '/session/new' }
  LOGOUT_TAB = { name: 'Log Out', url: '/session', id: 'logout-tab' }
  SIGN_UP_TAB = { name: 'Sign Up', url: '/account/new' }
  MY_ACCOUNT_TAB = { name: 'My Account', url: '/teachers/my_account', id: 'my-account-tab' }
  ADMIN_ACCESS_TAB = { name: 'Admin Access', url: '/admin_access' }
  MY_SUBSCRIPTIONS_TAB = { name: 'My Subscriptions', url: '/subscriptions' }
  HOME_TAB = { name: 'Home', url: '/', id: 'home-tab' }
  OVERVIEW_TAB = { name: 'Overview', url: '/teachers/classrooms/dashboard' }
  MY_CLASSES_TAB = { name: 'My Classes', url: '/teachers/classrooms' }
  ACTIVE_CLASSES_TAB = { name: 'Active Classes', url: '/teachers/classrooms' }
  ARCHIVED_CLASSES_TAB = { name: 'Archived Classes', url: '/teachers/classrooms/archived' }
  ASSIGN_ACTIVITIES_TAB = { name: 'Assign Activities', url: '/assign' }
  MY_ACTIVITIES_TAB = { name: 'My Activities', url: '/teachers/classrooms/activity_planner' }
  MY_REPORTS_TAB = { name: 'My Reports', url: '/teachers/progress_reports/landing_page' }
  ACTIVITY_SUMMARY_TAB = { name: 'Activity Summary', url: '/teachers/classrooms/scorebook' }
  ACTIVITY_ANALYSIS_TAB = { name: 'Activity Analysis', url: '/teachers/progress_reports/diagnostic_reports/#/activity_packs', id: 'mobile-activity-analysis-tab' }
  DIAGNOSTICS_TAB = { name: 'Diagnostics', url: '/teachers/progress_reports/diagnostic_reports/#/diagnostics', id: 'mobile-diagnostics-tab' }
  ACTIVITY_SCORES_TAB = { name: 'Activity Scores', url: '/teachers/progress_reports/activities_scores_by_classroom' }
  CONCEPTS_TAB = { name: 'Concepts', url: '/teachers/progress_reports/concepts/students' }
  STANDARDS_TAB = { name: 'Standards', url: '/teachers/progress_reports/standards/classrooms' }
  DATA_EXPORT_TAB = { name: 'Data Export', url: '/teachers/progress_reports/activity_sessions' }
  PREMIUM_TAB = { name: 'Premium', url: '/premium', id: 'premium-tab' }
  TEACHER_PREMIUM_TAB = { name: 'Teacher Premium', url: '/teacher_premium', id: 'premium-tab' }
  PREMIUM_HUB_TAB = { name: 'Premium Hub', url: '/teachers/premium_hub', id: 'admin-tab' }
  QUILL_ACADEMY_TAB = { name: 'Quill Academy', url: '/quill_academy', id: 'quill-academy-tab' }

  UNAUTHED_USER_TABS = [LEARNING_TOOLS_TAB, EXPLORE_CURRICULUM_TAB, TEACHER_CENTER_TAB, ABOUT_US_TAB, LOGIN_TAB, SIGN_UP_TAB]
  STUDENT_TABS = [LEARNING_TOOLS_TAB, STUDENT_CENTER_TAB, QUILL_SUPPORT_TAB, LOGOUT_TAB]
  COMMON_AUTHED_USER_TABS = [LEARNING_TOOLS_TAB, TEACHER_CENTER_TAB, QUILL_SUPPORT_TAB, MY_ACCOUNT_TAB, LOGOUT_TAB]

  def determine_active_tab(current_path)
    if current_path.include?('tools')
	    'Learning Tools'
    elsif ['about', 'announcements', 'mission', 'impact', 'press', 'team', 'pathways', 'careers'].any? { |str| current_path.include?(str)}
	    'About Us'
    # /activities/ is for the Featured Activities and ELA Standards sub pages of the Explore Curriculum section
    elsif ['/activities/', 'ap', 'preap', 'springboard'].any? { |str| current_path.include?(str)}
	    'Explore Curriculum'
    elsif ['teacher-center', 'faq'].any? { |str| current_path.include?(str)}
	    'Teacher Center'
    elsif current_path.include?('student-center')
      'Student Center'
    else
	    determine_dashboard_active_tab(current_path)
    end
  end

  def determine_active_subtab(current_path)
    if current_path.include?('teachers/classrooms/dashboard')
      'Overview'
    elsif current_path.include?('teachers/my_account')
      'My Account'
    elsif current_path.include?('subscriptions')
      'My Subscriptions'
    elsif current_path.include?('admin-access')
      'Admin Access'
    elsif current_path.include?('teachers/classrooms/archived')
      'Archived Classes'
    elsif current_path.include?('teachers/classrooms/scorebook')
      'Activity Summary'
    elsif current_path.include?('/teachers/classrooms')
      'Active Classes'
    elsif current_path.include?('/teachers/progress_reports/diagnostic_reports/#/activity_packs')
      'Activity Analysis'
    elsif current_path.include?('/teachers/progress_reports/diagnostic_reports/#/diagnostics')
      'Diagnostics'
    elsif current_path.include?('/teachers/progress_reports/activities_scores_by_classroom')
      'Activity Scores'
    elsif current_path.include?('/teachers/progress_reports/concepts/students')
      'Concepts'
    elsif current_path.include?('/teachers/progress_reports/standards/classrooms')
      'Standards'
    elsif current_path.include?('/teachers/progress_reports/activity_sessions')
      'Data Export'
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

  # this is a duplicate of the QuillAuthentication method, used here because we can't import it directly
  def admin_impersonating_user?(user)
    session[:admin_id].present? && session[:admin_id] != user.id
  end

  private def home_page_subnav_tabs
    tabs = [MY_ACCOUNT_TAB, MY_SUBSCRIPTIONS_TAB]
    if current_user.has_classrooms? || current_user.archived_classrooms.any? || current_user.coteacher_invitations.any?
      tabs.unshift(OVERVIEW_TAB)
    end
    if should_show_admin_access_tab?
      tabs.push(ADMIN_ACCESS_TAB)
    end
    tabs
  end

  private def determine_dashboard_active_tab(current_path)
    if current_path.include?('dashboard')
      'Overview'
    elsif ['my_account', 'subscriptions'].any? { |str| current_path.include?(str)}
      'My Account'
    elsif current_path.include?('assign')
      'Assign Activities'
    elsif current_path.include?('teachers/classrooms/activity_planner')
      'My Activities'
    elsif ['progress_reports', 'scorebook'].any? { |str| current_path.include?(str)}
      'My Reports'
    elsif current_path.include?('teachers/classrooms')
      'My Classes'
    elsif current_path.include?('teacher_premium')
      'Teacher Premium'
    elsif current_path.include?('premium_hub')
      'Premium Hub'
    elsif current_path.include?('premium')
      'Premium'
    elsif current_path.include?('quill_academy')
      'Quill Academy'
    else
      'Home'
    end
  end

  private def authed_user_tabs
    tabs = [HOME_TAB, OVERVIEW_TAB, MY_CLASSES_TAB, ASSIGN_ACTIVITIES_TAB, MY_ACTIVITIES_TAB, MY_REPORTS_TAB]

    unless current_user.premium_state == 'paid' || current_user.should_render_teacher_premium?
      tabs.push(PREMIUM_TAB)
    end

    if current_user.should_render_teacher_premium?
      tabs.push(TEACHER_PREMIUM_TAB)
    end

    if current_user.admin? && !admin_impersonating_user?(current_user)
      tabs.push(PREMIUM_HUB_TAB)
    end

    tabs.push(QUILL_ACADEMY_TAB)
    tabs.concat(COMMON_AUTHED_USER_TABS)
  end
end
