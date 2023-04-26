# frozen_string_literal: true

module NavbarHelper
  LEARNING_TOOLS_TAB = { name: 'Learning Tools', url: '/tools/connect' }
  EXPLORE_CURRICULUM_TAB = { name: 'Explore Curriculum', url: '/activities/packs' }
  TEACHER_CENTER_TAB = { name: 'Teacher Center', url: '/teacher-center' }
  STUDENT_CENTER_TAB = { name: 'Student Center', url: '/student-center' }
  QUILL_SUPPORT_TAB = { name: 'Quill Support', url: '/https://support.quill.org/' }
  ABOUT_US_TAB = { name: 'About Us', url: '/about' }
  LOGIN_TAB = { name: 'Log In', url: '/session/new' }
  LOGOUT_TAB = { name: 'Log Out', url: '/session', id: 'logout-tab' }
  SIGN_UP_TAB = { name: 'Sign Up', url: '/account/new' }
  MY_DASHBOARD_TAB = { name: 'My Dashboard', url: '/teachers/classrooms/dashboard' }
  MY_ACCOUNT_TAB = { name: 'My Account', url: '/teachers/my_account', id: 'my-account' }

  UNAUTHED_USER_TABS = [LEARNING_TOOLS_TAB, EXPLORE_CURRICULUM_TAB, TEACHER_CENTER_TAB, ABOUT_US_TAB, LOGIN_TAB, SIGN_UP_TAB]
  STUDENT_TABS = [LEARNING_TOOLS_TAB, STUDENT_CENTER_TAB, QUILL_SUPPORT_TAB, LOGOUT_TAB]
  AUTHED_USER_TABS = [LEARNING_TOOLS_TAB, TEACHER_CENTER_TAB, QUILL_SUPPORT_TAB, MY_DASHBOARD_TAB, MY_ACCOUNT_TAB, LOGOUT_TAB]

  def determine_active_tab(current_path)
    if current_path.include?('tools')
	    'Learning Tools'
    elsif ['about', 'announcements', 'mission', 'impact', 'press', 'team', 'pathways', 'careers'].any? { |str| current_path.include?(str)}
	    'About Us'
    elsif ['activities', 'ap', 'preap', 'springboard'].any? { |str| current_path.include?(str)}
	    'Explore Curriculum'
    elsif ['teacher-center', 'faq', 'premium'].any? { |str| current_path.include?(str)}
	    'Teacher Center'
    else
	    'Home'
    end
  end

  def determine_mobile_navbar_tabs
    return UNAUTHED_USER_TABS if !current_user

    return STUDENT_TABS if current_user&.role == 'student'

    return AUTHED_USER_TABS
  end
end
