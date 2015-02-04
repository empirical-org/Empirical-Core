class AssignActivityWorker
  include Sidekiq::Worker

  def perform(teacher_id)
    teacher = User.find(teacher_id)

    analytics = SegmentAnalytics.new
    analytics.track_activity_assignment(teacher)
  end
end