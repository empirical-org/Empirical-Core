namespace :elasticsearch do
  desc 'Reindex Responses in Elasticsearch'
  task build_response_index:, [:batch_size] => [:environment] do |task, args|
    (1..Response.last.id).step(args[:batch_size]).each do |starting_index|
      BulkReindexResponsesWorker.perform_async(starting_index, args[:batch_size] - 1)
    end
  end
end
