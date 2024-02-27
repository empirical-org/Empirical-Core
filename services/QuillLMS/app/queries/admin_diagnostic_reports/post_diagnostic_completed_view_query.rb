# frozen_string_literal: true

module AdminDiagnosticReports
  class PostDiagnosticCompletedViewQuery < DiagnosticAggregateViewQuery
    def root_query
      <<-SQL
        SELECT
            diagnostic_id,            
            diagnostic_name,            
            aggregate_id,            
            name,            
            group_by,            
            post_students_completed,            
            AVG(growth_percentage) AS overall_skill_growth
          FROM (#{super})
          GROUP BY diagnostic_id, diagnostic_name, aggregate_id, name, group_by, post_students_completed
      SQL
    end

    def specific_select_clause
      <<-SQL
        COUNT(DISTINCT performance.post_activity_session_id) AS post_students_completed,
        -- The value below is used to duplicate growth percentage calculations from teacher reports:
        --   It is intended to work only when aggregated at the Skill Group level
        --   The ROUND(..., 2) statements ensure that we aggregate at the same level of rounding as the teacher report uses (that report rounds all scores to integer percentages) which lets us avoid being off by 1% from the teacher reports because of higher precision
        --   The CASE statements ensure that we don't calculate the overall pre-Diagnostic performance, but rather calculate it only the performance for students who have also completed the post-Diagnostic
        --   NULL values are ignored when executing aggregate queries such as SUM, so rows from `performance` that have NULL "post" data will be excluded from the aggregation
        --   We subtract the pre-Diagnostic average from the post-Diagnostic average, and then use GREATEST to treat cases where post-Diagnostic scores are worse as if they were equal instead
        GREATEST(
         ROUND(SAFE_DIVIDE(SUM(performance.post_questions_correct), CAST(SUM(performance.post_questions_total) AS float64)), 2)
            - ROUND(SAFE_DIVIDE(SUM(CASE WHEN performance.post_activity_session_id IS NOT NULL THEN performance.pre_questions_correct ELSE NULL END),
              CAST(SUM(CASE WHEN performance.post_activity_session_id IS NOT NULL THEN performance.pre_questions_total ELSE NULL END) AS float64)), 2),
        0) AS growth_percentage
      SQL
    end

    def group_by_clause
      "#{super}, performance.skill_group_name, performance.classroom_id"
    end

    def relevant_date_column
      "performance.pre_activity_session_completed_at"
    end

    private def rollup_aggregation_hash
      {
        post_students_completed: sum_aggregate,
        overall_skill_growth: average_aggregate(:post_students_completed)
      }
    end
  end
end
