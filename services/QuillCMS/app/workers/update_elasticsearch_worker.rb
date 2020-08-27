class UpdateElasticsearchWorker
  include Sidekiq::Worker

  def perform(time_string)
    time_object = Time.parse(time_string)
    responses = Response.select(:id).where("updated_at >= ?", time_object - 24.hour)
    responses.each do |response|
      UpdateIndividualResponseWorker.perform_async(response.id)
    end
  end
end
