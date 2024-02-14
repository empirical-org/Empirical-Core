# frozen_string_literal: true

module AdminDiagnosticReports
  class PostDiagnosticCompletedViewQuery < DiagnosticAggregateQuery
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

    def from_and_join_clauses
      # NOTE: This implementation does not use super, and overrides the base query entirely in order to use materialized views
      <<-SQL
        FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.active_classroom_unit_stubs_view AS classroom_units ON performance.classroom_unit_id = classroom_units.id
        JOIN lms.active_classroom_stubs_view AS classrooms ON classroom_units.classroom_id = classrooms.id
        JOIN lms.classrooms_teachers ON classroom_units.classroom_id = classrooms_teachers.classroom_id
        JOIN lms.schools_users ON classrooms_teachers.user_id = schools_users.user_id
        JOIN lms.schools ON schools_users.school_id = schools.id
        JOIN lms.activities ON performance.activity_id = activities.id
      SQL
    end

    def group_by_clause
      "#{super}, performance.skill_group_name"
    end

    def relevant_date_column
      "performance.pre_activity_session_completed_at"
    end

    private def rollup_aggregation_hash
      {
        post_students_completed: sum_aggregate,
        overall_skill_growth: naive_average_aggregate
      }
    end
  end
end
