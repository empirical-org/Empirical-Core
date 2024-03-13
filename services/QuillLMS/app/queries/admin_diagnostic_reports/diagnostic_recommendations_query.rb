# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticRecommendationsQuery < DiagnosticAggregateQuery
    def specific_select_clause
      <<-SQL
          COUNT(DISTINCT CONCAT(classrooms.id, ':', activity_sessions.user_id)) AS students_completed_practice,
          SAFE_DIVIDE(COUNT(DISTINCT activity_sessions.id), COUNT(DISTINCT CONCAT(classrooms.id, ':', activity_sessions.user_id))) AS average_practice_activities_count,
          SAFE_DIVIDE(SUM(activity_sessions.timespent), COUNT(DISTINCT CONCAT(classrooms.id, ':', activity_sessions.user_id))) AS average_time_spent_seconds
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
            AND activity_sessions.visible = true
        JOIN lms.units
          ON classroom_units.unit_id = units.id
        JOIN lms.recommendations
          ON units.unit_template_id = recommendations.unit_template_id
        JOIN lms.activities
          ON recommendations.activity_id = activities.id
        JOIN lms.activity_sessions AS pre_diagnostic_session
          ON activities.id = pre_diagnostic_session.activity_id
            AND activity_sessions.user_id = pre_diagnostic_session.user_id
            AND activity_sessions.completed_at > pre_diagnostic_session.completed_at
        JOIN lms.classroom_units AS pre_diagnostic_classroom_unit
          ON pre_diagnostic_session.classroom_unit_id = pre_diagnostic_classroom_unit.id
            AND classroom_units.classroom_id = pre_diagnostic_classroom_unit.classroom_id
      SQL
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end

    private def rollup_aggregation_hash
      {
        students_completed_practice: sum_aggregate,
        average_practice_activities_count: average_aggregate(:students_completed_practice),
        average_time_spent_seconds: average_aggregate(:students_completed_practice)
      }
    end
  end
end
