# frozen_string_literal: true

class AssignActivityWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::DEFAULT, retry: false

  def perform(teacher_id, unit_id)
    analytics = SegmentAnalytics.new
    analytics.track_activity_pack_assignment(teacher_id, unit_id) if teacher_id
  end
end
