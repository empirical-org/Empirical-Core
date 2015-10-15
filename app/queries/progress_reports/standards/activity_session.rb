class ProgressReports::Standards::ActivitySession
  def initialize(teacher)
    @teacher = teacher
  end

  def results(filters)
    # for some reason indicating the root namespace is necessary in this first assignment
    query = ::ActivitySession.select(<<-SELECT
      activity_sessions.*,
      activities.topic_id as topic_id
    SELECT
    ).completed
      .with_best_scores
      .by_teacher(@teacher)
    ActivitySession.with_filters(query, filters)
  end
end