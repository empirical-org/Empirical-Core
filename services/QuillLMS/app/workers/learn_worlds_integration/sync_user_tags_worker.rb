# frozen_string_literal: true

module LearnWorldsIntegration
  class SyncUserTagsWorker
    include Sidekiq::Worker

    # To avoid hitting LearnWorlds API rate limiting
    SMEAR_RATE_IN_SECONDS = 5

    def perform(user_with_subject_areas)
      # user_account_type
      # subjects_taught
      LearnWorlds::UserTagsRequest.run(user_with_subject_areas)
    end

  end
end
