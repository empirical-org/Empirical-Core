# frozen_string_literal: true

module NavbarHelper
  include Rails.application.routes.url_helpers

  LEARNING_TOOLS_TAB = { name: 'Learning Tools', url: '/tools/connect' }
  EXPLORE_CURRICULUM_TAB = { name: 'Explore Curriculum', url: '/activities/packs' }
  TEACHER_CENTER_TAB = { name: 'Teacher Center', url: '/teacher-center' }
  STUDENT_CENTER_TAB = { name: 'Student Center', url: '/student-center' }
  QUILL_SUPPORT_TAB = { name: 'Quill Support', url: '/https://support.quill.org/' }
  ABOUT_US_TAB = { name: 'About Us', url: '/about' }
  LOGIN_TAB = { name: 'Log In', url: '/session/new' }
  LOGOUT_TAB = { name: 'Log Out', url: '/session', id: 'logout-tab' }
  SIGN_UP_TAB = { name: 'Sign Up', url: '/account/new' }
  MY_ACCOUNT_TAB = { name: 'My Account', url: '/teachers/my_account', id: 'my-account' }
  ADMIN_ACCESS_TAB = { name: 'Admin Access', url: '/admin_access' }
  MY_SUBSCRIPTIONS_TAB = { name: 'My Subscriptions', url: '/subscriptions' }
  HOME_TAB = { name: 'Home', url: '/' }
  OVERVIEW_TAB = { name: 'Overview', url: '/teachers/classrooms/dashboard' }
  MY_CLASSES_TAB = { name: 'My Classes', url: '/teachers/classrooms' }
  ACTIVE_CLASSES_TAB = { name: 'Active Classes', url: '/teachers/classrooms' }
  ARCHIVED_CLASSES_TAB = { name: 'Archived Classes', url: '/teachers/classrooms/archived' }
  ASSIGN_ACTIVITIES_TAB = { name: 'Assign Activities', url: '/assign' }
  MY_ACTIVITIES_TAB = { name: 'My Activities', url: '/teachers/classrooms/activity_planner' }
  MY_REPORTS_TAB = { name: 'My Reports', url: '/teachers/progress_reports/landing_page' }
  ACTIVITY_SUMMARY_TAB = { name: 'Activity Summary', url: '/teachers/classrooms/scorebook' }
  ACTIVITY_ANALYSIS_TAB = { name: 'Activity Analysis', url: '/teachers/progress_reports/diagnostic_reports/#/activity_packs' }
  DIAGNOSTICS_TAB = { name: 'Diagnostics', url: '/teachers/progress_reports/diagnostic_reports/#/diagnostics', id: 'diagnostics-tab' }
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


#   <% if should_render_subnav? %>
#     <div class="tab-subnavigation-wrapper mobile class-subnav <%= 'student-reports-subnav' if student_reports_page_active? %>">
#       <div class="container">
#         <ul>
#           <% if home_page_active? %>
#             <% if current_user.has_classrooms? || current_user.archived_classrooms.any? || current_user.coteacher_invitations.any? %>
#               <li><%= active_link_to 'Overview', dashboard_teachers_classrooms_path %></li>
#             <% end %>
#             <li><%= active_link_to 'My Account', teachers_my_account_path %></li>
#             <li><%= active_link_to 'My Subscriptions', subscriptions_path %></li>
#             <% if should_show_admin_access_tab? %>
#               <li><%= active_link_to 'Admin Access', admin_access_index_path %></li>
#             <% end %>
#           <% end %>

#           <% if classes_page_active? %>
#             <li><%= link_to 'Active Classes', teachers_classrooms_path, class: !current_path.include?('archived') ? 'active' : '' %></li>
#             <li><%= link_to 'Archived Classes', archived_teachers_classrooms_path, class: current_path.include?('archived') ? 'active' : '' %></li>
#           <% end %>

#           <% if student_reports_page_active? %>

#             <%# <li> %>
#               <%# active_link_to 'Real-time', '/teachers/progress_reports/real_time', class: 'default' %>
#             <%# </li>  %>

#             <li><%= active_link_to 'Activity Summary', scorebook_teachers_classrooms_path, class: 'default'%></li>
#             <li><%= active_link_to 'Activity Analysis', '/teachers/progress_reports/diagnostic_reports/#/activity_packs', class: 'default activity-analysis-tab'%></li>
#             <li><%= active_link_to 'Diagnostics', '/teachers/progress_reports/diagnostic_reports/#/diagnostics', class: 'default diagnostic-tab'%></li>
#             <li><a href='/teachers/progress_reports/activities_scores_by_classroom' class=<%=%w(/teachers/progress_reports/student_overview /teachers/progress_reports/activities_scores_by_classroom).include?(request.path) ? 'active' : nil%> ><span>Activity Scores</span><div class='small-diamond-icon'></div></a></li>
#             <li class="premium-reports-tab"><%= active_link_to raw('<span>Concepts</span><div class="small-diamond-icon"></div>'), teachers_progress_reports_concepts_students_path%></li>
#             <li class="premium-reports-tab"><%= active_link_to raw('<span>Standards</span><div class="small-diamond-icon"></div>'), teachers_progress_reports_standards_classrooms_path %></li>
#             <li class="premium-reports-tab"><%= active_link_to raw('<span>Data Export</span><div class="small-diamond-icon"></div>'), teachers_progress_reports_activity_sessions_path %></li>
#           <% end %>

#         </ul>
#       </div>
#     </div>
#   <% end %>

#   <% if student_reports_page_active? %>
#     <div id='premium-banner-container'></div>
#   <% end %>
# <% end %>

  private def determine_dashboard_active_tab(current_path)
    if current_path.include?('dashboard')
      'Overview'
    elsif current_path.include?('my_account')
      'My Account'
    elsif current_path.include?('assign')
      'Assign Activites'
    elsif current_path.include?('teachers/classrooms/activity_planner')
      'My Activites'
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
    tabs = [HOME_TAB, OVERVIEW_TAB, MY_CLASSES_TAB, MY_REPORTS_TAB]

    unless current_user.premium_state == 'paid' || should_render_teacher_premium?
      tabs.push(PREMIUM_TAB)
    end

    if should_render_teacher_premium?
      tabs.push(TEACHER_PREMIUM_TAB)
    end

    if current_user.admin? && !admin_impersonating_user?(current_user)
      tabs.push(PREMIUM_HUB_TAB)
    end

    tabs.push(QUILL_ACADEMY_TAB)
    tabs.concat(COMMON_AUTHED_USER_TABS)
  end
end
