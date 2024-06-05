# frozen_string_literal: true

module LearnWorldsIntegration
  class SyncUserTagsWorker
    include Sidekiq::Worker

    # To avoid hitting LearnWorlds API rate limiting
    SMEAR_RATE_IN_SECONDS = 5

    def perform(user_with_subject_areas)
      LearnWorldsIntegration::UserTagsRequest.run(user_with_subject_areas)
    end

  end
end
