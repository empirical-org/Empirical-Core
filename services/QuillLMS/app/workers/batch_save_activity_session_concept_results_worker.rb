# frozen_string_literal: true

class BatchSaveActivitySessionConceptResultsWorker
  include Sidekiq::Worker

  sidekiq_options queue: SidekiqQueue::CRITICAL

  def perform(concept_results, activity_session_id, activity_session_uid)
    batch_runner(activity_session_uid) do
      concept_results
        .map { |cr| concept_results_hash(cr, activity_session_id) }
        .reject(&:empty?)
        .each { |crh| SaveActivitySessionConceptResultsWorker.perform_async(crh) }
    end
  end

  def on_success(_status, options)
    PusherTrigger.run(options['activity_session_uid'], 'concept-results-saved', "Concept results saved for activity session with uid: #{options['activity_session_uid']}")
  end

  private def batch_runner(activity_session_uid, &save_concept_results)
    batch = Sidekiq::Batch.new
    batch.description = 'Saving Concept Results for Activity Session'
    batch.callback_queue = SidekiqQueue::CRITICAL
    batch.on(:success, self.class, activity_session_uid: activity_session_uid)
    batch.jobs { save_concept_results.call }
  end

  private def concept_results_hash(concept_result, activity_session_id)
    concept = Concept.find_by(uid: concept_result["concept_uid"])
    return {} if concept.blank?

    concept_result.merge(concept_id: concept.id, activity_session_id: activity_session_id)
  end
end
