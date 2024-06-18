# frozen_string_literal: true

module LearnWorldsIntegration
  class SyncOrchestratorWorker
    include Sidekiq::Worker

    def perform = SyncOrchestrator.run
  end
end
