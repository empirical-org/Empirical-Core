# frozen_string_literal: true

class SaveActivitySessionOldConceptResultsWorker
  include Sidekiq::Worker

  def perform(json_payload)
    SaveActivitySessionConceptResultsWorker.perform_async(json_payload)
  end
end
