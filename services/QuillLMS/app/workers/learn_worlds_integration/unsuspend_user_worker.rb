# frozen_string_literal: true

module LearnWorldsIntegration
  class UnsuspendUserWorker
    include Sidekiq::Worker
  end

  def perform; end
end