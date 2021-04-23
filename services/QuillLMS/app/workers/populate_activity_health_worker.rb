class PopulateActivityHealthWorker
  include Sidekiq::Worker

  def perform(id)
    @activity = Activity.find(id)

    serializer = SerializeActivityHealth.new(@activity)
    activity_health = ActivityHealth.create!(serializer.data)

    serializer.prompt_data.each do |prompt_data|
      PromptHealth.create!(prompt_data.merge({activity_health: activity_health}))
    end
  end
end
