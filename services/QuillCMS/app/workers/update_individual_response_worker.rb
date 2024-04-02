class UpdateIndividualResponseWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(response_id)
    Response.find(response_id).update_index_in_elastic_search
  end
end
