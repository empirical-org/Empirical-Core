# frozen_string_literal: true

class ErrorWorker
  include Sidekiq::Worker

  def perform
    ea = ErrorAnalytics.new
    ea.track500
  end

end
