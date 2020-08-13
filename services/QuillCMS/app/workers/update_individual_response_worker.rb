class UpdateIndividualResponseWorker
  include Sidekiq::Worker

  def perform(response_id)
    response = Response.find(response_id)
    response.update_index_in_elastic_search
  end
end