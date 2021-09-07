class BulkReindexResponsesWorker
  include Sidekiq::Worker
  sidekiq_options retry: 5, queue: 'low'

  def client
    @client = Elasticsearch::Client.new url: ENV['ELASTICSEARCH_URL']
  end

  def perform(starting_index, batch_size)
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
end
