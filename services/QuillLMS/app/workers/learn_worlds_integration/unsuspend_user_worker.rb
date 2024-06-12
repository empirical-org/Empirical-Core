# frozen_string_literal: true

module LearnWorldsIntegration
  class UnsuspendUserWorker
    include Sidekiq::Worker

    def perform(external_id) = UnsuspendUserRequest.run(external_id)
  end
end
