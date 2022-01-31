# frozen_string_literal: true

class ResetGhostInspectorAccountWorker
  include Sidekiq::Worker

  def perform
    GhostInspectorAccountResetter.run
  end
end
