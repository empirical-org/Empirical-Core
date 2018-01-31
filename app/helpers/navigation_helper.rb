module NavigationHelper
  def home_page_should_be_active?
    (current_page?(controller: 'teachers/classroom_manager', action: 'dashboard') ||
    ['invite_students', 'dashboard', 'my_account', 'teacher_guide', 'google_sync'].include?(action_name)) &&
    action_name != 'invite_students'
  end

  def classes_page_should_be_active?
    controller.class == Teachers::ClassroomsController || controller_name == 'students' || action_name == 'invite_students'
  end

  def assign_activity_page_should_be_active?
    current_page?(controller: 'teachers/classroom_manager', action: 'assign_activities')
  end

  def my_activities_page_should_be_active?
    current_page?(controller: 'teachers/classroom_manager', action: 'lesson_planner')
  end

  def student_reports_page_should_be_active?
    controller.class == Teachers::ProgressReportsController ||
    controller.class.parent == Teachers::ProgressReports ||
    controller.class.parent == Teachers::ProgressReports::Standards ||
    controller.class.parent == Teachers::ProgressReports::Concepts ||
    action_name == 'scorebook'
  end

  def teacher_resources_page_should_be_active?
    controller.class == BlogPostsController
  end

  def premium_page_should_be_active?

  end

  def premium_tab_copy
    case current_user.premium_state
    when 'trial'
      "Premium  <i class='fa fa-star'></i> #{current_user.trial_days_remaining} Days Left"
    when 'locked'
      "Premium  <i class='fa fa-star'></i> Trial Expired"
    else
      "Try Premium <i class='fa fa-star'></i>"
    end
  end
end
