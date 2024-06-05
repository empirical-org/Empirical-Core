# frozen_string_literal: true

module LearnWorldsIntegration
  class SyncUserTagsWorker
    include Sidekiq::Worker

    sidekiq_options queue: SidekiqQueue::EXPERIMENT

    def perform(user_with_subject_areas)
      LearnWorldsIntegration::UserTagsRequest.run(user_with_subject_areas)
    end

  end
end
