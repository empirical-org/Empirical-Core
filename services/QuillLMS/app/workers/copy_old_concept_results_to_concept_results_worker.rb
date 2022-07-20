# frozen_string_literal: true

class CopyOldConceptResultsToConceptResultsWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::MIGRATION

  def perform(start, finish)
    (start..finish).each do |old_concept_result_id|
      CopySingleConceptResultWorker.perform_async(old_concept_result_id)
    end
  end
end
