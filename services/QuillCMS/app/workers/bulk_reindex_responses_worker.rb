require 'sidekiq/api'

class BulkReindexResponsesWorker
  include Sidekiq::Worker
  sidekiq_options retry: 5, queue: 'low'

  def perform(starting_index, end_index, batch_size)
    Response.find_in_batches(start: starting_index, finish: end_index, batch_size: batch_size) do |batch|
      Response.__elasticsearch__.client.bulk(
        index: "responses",
        type: "response",
        body: batch.map { |r| {index: {_id: r.id, data: r.as_indexed_json}}}
      )
    end
  end

  def self.cancel!(jid)
    Sidekiq::ScheduledSet.new.find_job(jid).try(:delete)
  end
end
