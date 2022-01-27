# frozen_string_literal: true

class OnboardingChecklistAnalyticsWorker
  include Sidekiq::Worker

  def perform(user_id)
    all_objectives_met = Objective::ONBOARDING_CHECKLIST_NAMES.all? do |name|
      objective = Objective.find_by_name(name)
      Checkbox.find_by(user_id: user_id, objective_id: objective.id)
    end

    return unless all_objectives_met

    analytics = SegmentAnalytics.new
    analytics.track_event_from_string("TEACHER_COMPLETED_ONBOARDING_CHECKLIST", user_id)
  end
end
