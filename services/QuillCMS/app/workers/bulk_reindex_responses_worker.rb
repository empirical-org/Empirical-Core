require 'sidekiq/api'

class BulkReindexResponsesWorker
  include Sidekiq::Worker
  sidekiq_options retry: 5, queue: 'low'

  def perform(starting_index, batch_size)
    return if cancelled?

    batch_for_bulk = []
    Response.where(id: starting_index..(starting_index+batch_size)).each do |response|
      batch_for_bulk.push({ index: { _id: response.id, data: response.as_indexed_json } })
    end
    Response.__elasticsearch__.client.bulk(
      index: "responses",
      type: "response",
      body: batch_for_bulk
    )
  end

  def cancelled?
    Sidekiq::ScheduledSet.new.find_job(jid).present?
  end

  def self.cancel!(jid)
    Sidekiq::ScheduledSet.new.find_job(jid).try(:delete)
  end
end
