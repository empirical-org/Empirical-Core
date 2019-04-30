namespace :concepts_in_use do
  task get: :environment do
    last_set = $redis.get("NUMBER_OF_CONCEPTS_IN_USE_LAST_SET")
    if !last_set || 7.days.ago >= Date.parse(last_set, "%d-%m-%Y")
      GenerateConceptsInUseArrayWorker.perform_async
    end
  end
end
