# frozen_string_literal: true

class SaveActivitySessionOldConceptResultsWorker
  include Sidekiq::Worker

  def perform(concept_results_hashes)
    ocr_ids = []
    OldConceptResult.transaction do
      concept_results_hashes.each do |concept_result_hash|
        ocr_ids.append(OldConceptResult.create!(concept_result_hash).id)
      end
    end
    SaveActivitySessionConceptResultsWorker.perform_async(ocr_ids)
  end
end
