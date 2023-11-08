# frozen_string_literal: true

module AdminDiagnosticReports
  class PreDiagnosticCompletedQuery < DiagnosticAggregateQuery
    def query
      <<-SQL
        SELECT
            diagnostic_id,
            diagnostic_name,
            COUNT(DISTINCT activity_session_id) AS pre_students_completed,
            SAFE_DIVIDE(SUM(CAST(optimal AS INT64)), CAST(COUNT(DISTINCT concept_result_id) AS FLOAT64)) AS average_score
          FROM (#{super})
          GROUP BY diagnostic_id, diagnostic_name, #{additional_aggregation}
      SQL
    end

    def specific_select_clause
      <<-SQL
        activity_sessions.id AS activity_session_id,
        MAX(concept_results.correct) AS optimal,
        MAX(concept_results.id) AS concept_result_id,
        #{additional_aggregation}
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

    def group_by_clause
      "#{super}, activity_sessions.id, concept_results.question_number"
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end

    private def aggregate_diagnostic(rows)
      {
        pre_students_completed: roll_up_sum(rows, :pre_students_completed),
        pre_average_score: roll_up_average(rows, :average_score, :pre_students_completed)
      }
    end
  end
end
