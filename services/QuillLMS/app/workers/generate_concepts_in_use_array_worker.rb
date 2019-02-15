class GenerateConceptsInUseArrayWorker
  include Sidekiq::Worker

  def perform
    Concept.get_concepts_in_use
  end
end
