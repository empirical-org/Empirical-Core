class AssignActivityWorker
  include Sidekiq::Worker

  def perform(teacher_id, unit_id)
    analytics = SegmentAnalytics.new
    analytics.track_activity_pack_assignment(teacher_id, unit_id) if teacher_id
  end
end
