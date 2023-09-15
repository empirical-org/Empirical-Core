# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticRecommendationsQuery < DiagnosticAggregateQuery
    def specific_select_clause
      <<-SQL
          COUNT(DISTINCT activity_sessions.user_id) AS students_completed_practice,
          COUNT(DISTINCT activity_sessions.id) AS total_practice_activities_completed,
          SUM(activity_sessions.timespent) AS total_time_practiced
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

    def where_clause
      super + <<-SQL
          #{activity_classification_where_clause}
          #{pre_diagnostics_where_clause}
      SQL
    end

    def activity_classification_where_clause
      "AND activities.activity_classification_id = #{DIAGNOSTIC_CLASSIFICATION_ID}"
    end

    def pre_diagnostics_where_clause
      "AND activities.follow_up_activity_id IS NOT NULL"
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end
  end
end
