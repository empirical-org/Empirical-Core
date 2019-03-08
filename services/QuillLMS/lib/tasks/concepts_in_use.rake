namespace :concepts_in_use do
  task get: :environment do
    GenerateConceptsInUseArrayWorker.perform_async
  end
end
