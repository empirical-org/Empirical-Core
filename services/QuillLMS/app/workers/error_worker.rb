# frozen_string_literal: true

class ErrorWorker
  include Sidekiq::Worker

  def perform
    Analytics::ErrorAnalytics
      .new
      .track500
  end
end
