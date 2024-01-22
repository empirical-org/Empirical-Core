# frozen_string_literal: true

module AdminDiagnosticReports
  class PostDiagnosticCompletedQuery < DiagnosticAggregateQuery
    def root_query
      <<-SQL
        SELECT
            diagnostic_id,
            diagnostic_name,
            aggregate_id,
            name,
            group_by,
            COUNT(DISTINCT activity_session_id) AS post_students_completed,
            SAFE_DIVIDE(SUM(CAST(optimal AS INT64)), CAST(COUNT(DISTINCT concept_result_id) AS FLOAT64)) AS post_average_score
          FROM (#{super})
          GROUP BY diagnostic_id, diagnostic_name, aggregate_id, name, group_by
      SQL
    end

    def specific_select_clause
      <<-SQL
        activity_sessions.id AS activity_session_id,
        MAX(concept_results.correct) AS optimal,
        MAX(concept_results.id) AS concept_result_id
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
            AND activity_sessions.visible = true
        JOIN special.concept_results
          ON activity_sessions.id = concept_results.activity_session_id
        JOIN lms.activities AS post_activities
          ON activity_sessions.activity_id = post_activities.id
        JOIN lms.activities
          ON post_activities.id = activities.follow_up_activity_id
      SQL
    end

    def group_by_clause
      "#{super}, activity_sessions.id, concept_results.question_number"
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end

    private def rollup_aggregation_hash
      {
        post_students_completed: sum_aggregate,
        post_average_score: average_aggregate(:post_students_completed)
      }
    end
  end
end
