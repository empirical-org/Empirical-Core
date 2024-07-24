# frozen_string_literal: true

module LearnWorldsIntegration
  class SyncUserTagsWorker
    include Sidekiq::Worker

    def perform(external_id, tags)
      LearnWorldsIntegration::UserTagsRequest.run(external_id, tags)
    end
  end
end
