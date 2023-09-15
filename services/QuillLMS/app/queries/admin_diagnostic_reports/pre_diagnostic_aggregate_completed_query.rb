# frozen_string_literal: true

module AdminDiagnosticReports
  class PreDiagnosticAggregateCompletedQuery < DiagnosticAggregateQuery
    def specific_select_clause
      <<-SQL
          COUNT(DISTINCT activity_sessions.id) AS pre_students_assigned
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN lms.activities
          ON activity_sessions.activity_id = activities.id
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
