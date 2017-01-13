class AssignRecommendationsWorker
  include Sidekiq::Worker

  def perform(teacher_id)
    teacher = User.find(teacher_id)

    analytics = AssignRecommendationsAnalytics.new
    analytics.track_activity_assignment(teacher)
  end
end
