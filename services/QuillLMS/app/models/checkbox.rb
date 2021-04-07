# == Schema Information
#
# Table name: checkboxes
#
#  id           :integer          not null, primary key
#  metadata     :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  objective_id :integer
#  user_id      :integer
#
# Indexes
#
#  index_checkboxes_on_user_id_and_objective_id  (user_id,objective_id) UNIQUE
#
class Checkbox < ActiveRecord::Base
  belongs_to :objective
  belongs_to :user
  validates :objective_id, uniqueness: { scope: :user_id, message: "should only be checked once per user" }
  after_create :track_onboarding_checklist_analytics

  def track_onboarding_checklist_analytics
    return unless Objective::ONBOARDING_CHECKLIST_NAMES.include?(objective.name)

    OnboardingChecklistAnalyticsWorker.perform_async(user_id)
  end

end
