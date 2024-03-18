# frozen_string_literal: true

module AdminDiagnosticReports
  class PreDiagnosticCompletedViewQuery < DiagnosticAggregateViewQuery
    def root_query
      <<-SQL
        SELECT
            diagnostic_id,
            diagnostic_name,
            aggregate_id,
            name,
            group_by,
            COUNT(DISTINCT activity_session_id) AS pre_students_completed,
            SAFE_DIVIDE(SUM(pre_questions_correct), CAST(SUM(pre_questions_total) AS FLOAT64)) AS pre_average_score
          FROM (#{super})
          GROUP BY diagnostic_id, diagnostic_name, aggregate_id, name, group_by
      SQL
    end

    def specific_select_clause
      <<-SQL
        performance.pre_activity_session_id AS activity_session_id,
        SUM(performance.pre_questions_correct) AS pre_questions_correct,
        SUM(performance.pre_questions_total) AS pre_questions_total
      SQL
    end

    def group_by_clause
      "#{super}, activity_session_id"
    end

    def relevant_date_column
      "performance.pre_activity_session_completed_at"
    end

    private def rollup_aggregation_hash
      {
        pre_students_completed: sum_aggregate,
        pre_average_score: average_aggregate(:pre_students_completed)
      }
    end
  end
end
