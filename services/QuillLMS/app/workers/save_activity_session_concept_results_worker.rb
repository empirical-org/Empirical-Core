# frozen_string_literal: true

class SaveActivitySessionConceptResultsWorker
  include Sidekiq::Worker

  sidekiq_options queue: SidekiqQueue::CRITICAL

  class ConceptResultCopyFailedException < StandardError; end

  def perform(json_payload)
    if json_payload.is_a?(Array)
      json_payload.each { |payload| create_records(payload) }
    else
      create_records(json_payload)
    end
  end

  private def create_records(json_payload)
    SaveActivitySessionConceptResultWorker.perform_async(json_payload)
  end
end
