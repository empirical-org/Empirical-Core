# frozen_string_literal: true

class ProgressReports::Standards::ActivitySession
  def initialize(teacher)
    @teacher = teacher
  end

  def results(filters = {})
    query =
      ::ActivitySession
        .select('activity_sessions.*, activities.standard_id as standard_id')
        .completed
        .with_best_scores
        .by_teacher(@teacher)

    ActivitySession.with_filters(query, filters)
  end
end
