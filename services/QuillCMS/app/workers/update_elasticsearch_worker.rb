class UpdateElasticsearchWorker
  include Sidekiq::Worker

  def perform(time)
    responses = Response.select(:id).where("updated_at >= ?", time.beginning_of_day)
    responses.each do |response|
      UpdateIndividualResponseWorker.perform_async(response.id)
    end
  end
end