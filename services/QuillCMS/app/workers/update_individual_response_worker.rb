class UpdateIndividualResponseWorker
  include Sidekiq::Worker

  def perform(response_id)
    Response.find(response_id).update_index_in_elastic_search
  end
end
