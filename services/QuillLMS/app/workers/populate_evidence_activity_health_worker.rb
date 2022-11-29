# frozen_string_literal: true

class PopulateEvidenceActivityHealthWorker
  include Sidekiq::Worker
  sidekiq_options retry: 1

  def perform(id)
    @activity = Evidence::Activity.find(id)

    serializer = SerializeEvidenceActivityHealth.new(@activity)
    activity_health = Evidence::ActivityHealth.create(serializer.data)

    return unless activity_health.valid?

    serializer.prompt_data&.each do |prompt_data|
      Evidence::PromptHealth.create!(prompt_data.merge({activity_health: activity_health}))
    end
  end
end
