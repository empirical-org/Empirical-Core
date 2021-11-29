# frozen_string_literal: true

class ErrorWorker
  include Sidekiq::Worker

  def perform
    ea = ErrorAnalytics.new
    ea.track_500
  end

end
