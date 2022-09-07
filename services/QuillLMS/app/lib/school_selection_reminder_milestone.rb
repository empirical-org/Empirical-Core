module SchoolSelectionReminderMilestone
  extend ActiveSupport::Concern
  include ActionController::Helpers
  include QuillAuthentication

  included do
    helper_method :show_school_selection_reminders
  end

  def show_school_selection_reminders
    return false if !current_user

    dismiss_school_selection_reminder_milestone = Milestone.find_by_name(Milestone::TYPES[:dismiss_school_selection_reminder])
    UserMilestone.find_by(milestone_id: dismiss_school_selection_reminder_milestone&.id, user_id: current_user.id).nil? && [nil, School::NO_SCHOOL_SELECTED_SCHOOL_NAME].include?(current_user.school&.name)
  end
end
