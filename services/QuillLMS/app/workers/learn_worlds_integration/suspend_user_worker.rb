# frozen_string_literal: true

module LearnWorldsIntegration
  class SuspendUserWorker
    include Sidekiq::Worker

    def perform(external_id) = SuspendUserRequest.run(external_id)
  end
end
