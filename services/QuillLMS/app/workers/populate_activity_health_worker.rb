# frozen_string_literal: true

class PopulateActivityHealthWorker
  include Sidekiq::Worker
  sidekiq_options retry: 1

  def perform(id)
    @activity = Activity.find(id)

    serializer = SerializeActivityHealth.new(@activity)
    activity_health = ActivityHealth.create(serializer.data)

    return unless activity_health.valid?

    serializer.prompt_data&.each do |prompt_data|
      PromptHealth.create!(prompt_data.merge({activity_health: activity_health}))
    end
  end
end
