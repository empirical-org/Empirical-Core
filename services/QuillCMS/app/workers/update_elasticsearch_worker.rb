class UpdateElasticsearchWorker
  include Sidekiq::Worker

  def perform(time_string)
    time_object = Time.parse(time_string)
    responses = Response.select(:id).where("updated_at >= ?", time_object.beginning_of_day)
    responses.each do |response|
      UpdateIndividualResponseWorker.perform_async(response.id)
    end
  end
end
