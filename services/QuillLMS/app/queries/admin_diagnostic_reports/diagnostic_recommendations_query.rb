# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticRecommendationsQuery < DiagnosticAggregateQuery
    def specific_select_clause
      <<-SQL
          COUNT(DISTINCT activity_sessions.user_id) AS students_completed_practice,
          SAFE_DIVIDE(COUNT(DISTINCT activity_sessions.id), COUNT(DISTINCT activity_sessions.user_id)) AS average_practice_activities_count,
          SAFE_DIVIDE(SUM(activity_sessions.timespent), COUNT(DISTINCT activity_sessions.user_id)) AS average_time_spent_seconds
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN lms.units
          ON classroom_units.unit_id = units.id
        JOIN lms.recommendations
          ON units.unit_template_id = recommendations.unit_template_id
        JOIN lms.activities
          ON recommendations.activity_id = activities.id
      SQL
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end

    private def aggregate_diagnostic(rows)
      {
        students_completed_practice: roll_up_sum(rows, :students_completed_practice),
        average_practice_activities_count: roll_up_average(rows, :average_practice_activities_count, :students_completed_practice),
        average_time_spent_seconds: roll_up_average(rows, :average_time_spent_seconds, :students_completed_practice)
      }
    end
  end
end
