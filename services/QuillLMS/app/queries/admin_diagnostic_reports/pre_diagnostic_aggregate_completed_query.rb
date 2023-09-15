# frozen_string_literal: true

module AdminDiagnosticReports
  class PreDiagnosticAggregateCompletedQuery < DiagnosticAggregateQuery
    def specific_select_clause
      <<-SQL
          COUNT(DISTINCT activity_sessions.id) AS pre_students_completed
          AVG(activity_sessions.percentage) AS pre_average_percentage
      SQL
    end

    def scores_subquery
      <<-SQL
        SELECT
            activity_sessions.id,
            SAFE_DIVIDE(MAX(concept_results.question_number), COUNT(concept_results.correct = true)) * 100 AS score
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN special.concept_results
          ON activity_sessions.id = concept_results.activity_session_id
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
