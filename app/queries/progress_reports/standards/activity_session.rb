class ProgressReports::Standards::ActivitySession
  def initialize(teacher)
    @teacher = teacher
  end

  def results(filters)
    query = ActivitySession.select(<<-SELECT
      activity_sessions.*,
      activities.topic_id as topic_id
    SELECT
    ).completed
      .with_best_scores
      .by_teacher(@teacher)
    ActivitySession.with_filters(query, filters)
  end
end