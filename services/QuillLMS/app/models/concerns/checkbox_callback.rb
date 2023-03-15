# frozen_string_literal: true

module CheckboxCallback
  extend ActiveSupport::Concern

  def find_or_create_checkbox(name, user, activity_id=nil)
    objective = Objective.find_by(name: name)

    return unless objective && user

    begin
      Checkbox.transaction(requires_new: true) do
        Checkbox.find_or_create_by!(user: user, objective: objective)
        CheckboxAnalyticsWorker.perform_async(user.id, activity_id) if activity_id
      end
    rescue ActiveRecord::RecordNotUnique
      retry
    end
  end
end
