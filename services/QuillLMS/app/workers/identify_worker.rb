# frozen_string_literal: true

class IdentifyWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::LOW

  def perform(id)
    user = User.find_by_id(id)
    return unless user

    analytics = SegmentAnalytics.new
    analytics.identify(user)
  end
end
