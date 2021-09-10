require 'sidekiq/api'

class BulkReindexResponsesWorker
  include Sidekiq::Worker
  sidekiq_options retry: 5, queue: 'low'

  def perform(starting_index, end_index, batch_size)
    responses = Response.find_each(start: starting_index, finish: end_index, batch_size: batch_size)
    Response.__elasticsearch__.client.bulk(
      index: "responses",
      type: "response",
      body: responses.map { |r| {index: {_id: r.id, data: r.as_indexed_json}}}
    )
  end

  def self.cancel!(jid)
    Sidekiq::ScheduledSet.new.find_job(jid).try(:delete)
  end
end
