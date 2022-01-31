# frozen_string_literal: true

module CheckboxCallback
  extend ActiveSupport::Concern

  def find_or_create_checkbox(name, user, activity_id=nil)
    return unless Objective.find_by_name(name) && user

    Checkbox.find_or_create_by(user_id: user.id, objective_id: Objective.find_by_name(name).id)
    CheckboxAnalyticsWorker.perform_async(user.id, activity_id) if activity_id
  rescue => e
    puts "Race condition"
  end
end
