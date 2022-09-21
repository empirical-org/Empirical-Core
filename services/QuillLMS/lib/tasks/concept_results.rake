# frozen_string_literal: true

namespace :concept_results do
  desc 'Clear the Sidekiq queue of jobs attempting to save ConceptResults, but missing activity_session_id (which will cause the job to error)'
  # Based on example code from the Sidekiq docs: https://github.com/mperham/sidekiq/wiki/API#retries
  task clear_bad_job_payloads: :environment do
    query = Sidekiq::RetrySet.new
    query.select do |job|
      job.klass == 'SaveActivitySessionConceptResultsWorker' &&
      job.args[0]['activity_session_id'].nil?
    end.map(&:delete)
  end
end
