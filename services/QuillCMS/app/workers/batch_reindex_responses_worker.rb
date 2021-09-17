require 'sidekiq/api'

class BatchReindexResponsesWorker
  include Sidekiq::Worker
  sidekiq_options retry: 5, queue: 'low'

  def perform(start_index, end_index)
    responses = Response.where(id: start_index..end_index)
    Response.__elasticsearch__.client.bulk(
      index: "responses",
      type: "response",
      body: responses.map { |r| {index: {_id: r.id, data: r.as_indexed_json}}}
    )
  end

end
