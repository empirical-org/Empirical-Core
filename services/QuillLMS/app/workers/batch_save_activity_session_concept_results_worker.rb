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

  def on_complete(status, options)
    activity_session_uid = options['activity_session_uid']

    delete_student_score_cache(activity_session_uid)

    if status.failures == 0
      PusherTrigger.run(activity_session_uid, 'concept-results-saved', "Concept results saved for activity session with uid: #{options['activity_session_uid']}")
    else
      PusherTrigger.run(activity_session_uid, 'concept-results-partially-saved', "Concept results partially saved for activity session with uid: #{options['activity_session_uid']}, #{status.total - status.failures} succeeded, #{status.failures} failed")
    end
  end

  private def delete_student_score_cache(activity_session_uid)
    session = ActivitySession.find_by(uid: activity_session_uid)

    return unless session&.user_id

    classroom_id = session.classroom_unit&.classroom_id

    cache_key = User.student_scores_cache_key(session.user_id, classroom_id)

    Rails.cache.delete(cache_key)
  end

  private def batch_runner(activity_session_uid, &save_concept_results)
    batch = Sidekiq::Batch.new
    batch.description = 'Saving Concept Results for Activity Session'
    batch.callback_queue = SidekiqQueue::CRITICAL
    batch.on(:complete, self.class, activity_session_uid: activity_session_uid)
    batch.jobs { save_concept_results.call }
  end

  private def concept_results_hash(concept_result, activity_session_id)
    concept = Concept.find_by(uid: concept_result['concept_uid'])
    return {} if concept.blank?

    concept_result.merge(concept_id: concept.id, activity_session_id: activity_session_id)
  end
end
