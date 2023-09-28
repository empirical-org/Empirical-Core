# frozen_string_literal: true

module AdminDiagnosticReports
  class PreDiagnosticAggregateCompletedQuery < DiagnosticAggregateQuery
    def query
      <<-SQL
        SELECT
            name,
            COUNT(DISTINCT activity_session_id) AS pre_students_completed,
            SAFE_DIVIDE(SUM(CAST(optimal AS INT64)), CAST(COUNT(DISTINCT concept_result_id) AS FLOAT64)) AS average_score
          FROM (#{super})
          GROUP BY name #{additional_aggregation_group_by_clause}
      SQL
    end

    def select_clause
      <<-SQL
        SELECT
          activities.name,
          activity_sessions.id AS activity_session_id,
          MAX(concept_results.correct) AS optimal,
          MAX(concept_results.id) AS concept_result_id
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

    def group_by_clause
      super + ", activity_sessions.id, concept_results.question_number"
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
