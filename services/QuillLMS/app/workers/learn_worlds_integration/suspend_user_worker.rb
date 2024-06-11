# frozen_string_literal: true

module LearnWorldsIntegration
  class SuspendUserWorker
    include Sidekiq::Worker
  end

  def perform; end
end