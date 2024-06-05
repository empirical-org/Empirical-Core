# frozen_string_literal: true

module LearnWorldsIntegration
  class SyncOrchestratorWorker
    include Sidekiq::Worker

    # Note: this worker 'smears' API calls over time to avoid hitting
    # the LearnWorlds 30 requests / 10 seconds rate limit.
    SMEAR_RATE_IN_SECONDS = 1

    def perform
      userwise_subject_areas_relation = LearnWorldsAccount.all.includes(user: { teacher_info: [:subject_areas] } )
      userwise_subject_areas_relation.find_each.with_index do |row, idx|
        SyncUserTagsWorker.perform_in((idx * SMEAR_RATE_IN_SECONDS).seconds, row)
      end
    end

  end
end
