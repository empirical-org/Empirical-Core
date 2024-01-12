# frozen_string_literal: true

class PopulateEvidenceActivityHealthWorker
  include Sidekiq::Worker
  sidekiq_options retry: 1

  def perform(id)
    @activity = Evidence::Activity.find(id)
    # if a record already exists, that means an exception was thrown somewhere and this worker is a retry,
    # so delete the record that ran into an exception
    Evidence::ActivityHealth.find_by(activity_id: id)&.destroy

    prompt_feedback_history = PromptFeedbackHistory.run(activity_id: @activity.id, activity_version: @activity.version)
    serializer = SerializeEvidenceActivityHealth.new(@activity, prompt_feedback_history)
    activity_health = Evidence::ActivityHealth.create(serializer.data)

    return unless activity_health.valid?

    serializer.prompt_data&.each do |prompt_data|
      Evidence::PromptHealth.create!(prompt_data.merge({evidence_activity_health_id: activity_health.id}))
    end
  end
end
