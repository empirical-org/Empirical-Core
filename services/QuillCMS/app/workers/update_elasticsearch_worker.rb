class UpdateElasticsearchWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(start_time_string, end_time_string)
    start_time_object = Time.parse(start_time_string)
    end_time_object = Time.parse(end_time_string)
    responses = Response.select(:id).where(updated_at: start_time_object..end_time_object)
    responses.find_each do |response|
      UpdateIndividualResponseWorker.perform_async(response.id)
    end
  end
end
