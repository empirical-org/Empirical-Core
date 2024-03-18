# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticPerformanceBySkillViewQuery < DiagnosticAggregateViewQuery
    class InvalidDiagnosticIdError < StandardError; end

    attr_reader :diagnostic_id

    AGGREGATE_COLUMN = :skill_group_name

    def initialize(diagnostic_id:, **options)
      raise InvalidDiagnosticIdError, "#{diagnostic_id} is not a valid diagnostic_id value." unless DIAGNOSTIC_ORDER_BY_ID.include?(diagnostic_id.to_i)

      @diagnostic_id = diagnostic_id

      super(**options)
    end

    def specific_select_clause
      <<-SQL
        COUNT(DISTINCT performance.pre_activity_session_id) AS pre_students_completed,
        COUNT(DISTINCT performance.post_activity_session_id) AS post_students_completed,
        ROUND(SAFE_DIVIDE(SUM(performance.pre_questions_correct), CAST(SUM(performance.pre_questions_total) AS float64)), 2) AS pre_score,
        ROUND(SAFE_DIVIDE(SUM(performance.post_questions_correct), CAST(SUM(performance.post_questions_total) AS float64)), 2) AS post_score,
        /*
        The value below is used to duplicate growth percentage calculations from teacher reports:
          It is intended to work only when aggregated at the Skill Group level
          The ROUND(..., 2) statements ensure that we aggregate at the same level of rounding as the teacher report uses (that report rounds all scores to integer percentages) which lets us avoid being off by 1% from the teacher reports because of higher precision
          The CASE statements ensure that we don't calculate the overall pre-Diagnostic performance, but rather calculate it only the performance for students who have also completed the post-Diagnostic
          NULL values are ignored when executing aggregate queries such as SUM, so rows from `performance` that have NULL "post" data will be excluded from the aggregation
          We subtract the pre-Diagnostic average from the post-Diagnostic average, and then use GREATEST to treat cases where post-Diagnostic scores are worse as if they were equal instead
        */
        GREATEST(
          ROUND(SAFE_DIVIDE(SUM(performance.post_questions_correct), CAST(SUM(performance.post_questions_total) AS float64)), 2)
            - ROUND(SAFE_DIVIDE(SUM(CASE WHEN performance.post_activity_session_id IS NOT NULL THEN performance.pre_questions_correct ELSE NULL END),
                CAST(SUM(CASE WHEN performance.post_activity_session_id IS NOT NULL THEN performance.pre_questions_total ELSE NULL END) AS float64)), 2),
        0) AS growth_percentage,
        COUNT(DISTINCT CASE WHEN (pre_questions_correct = pre_questions_total AND post_questions_correct = post_questions_total) THEN performance.student_id ELSE NULL END) AS maintained_proficiency,
        COUNT(DISTINCT CASE WHEN (pre_questions_correct < pre_questions_total AND post_questions_correct > pre_questions_correct) THEN performance.student_id ELSE NULL END) AS improved_proficiency,
        COUNT(DISTINCT CASE WHEN (post_questions_correct < pre_questions_correct OR (pre_questions_correct < pre_questions_total AND post_questions_correct = pre_questions_correct)) THEN performance.student_id ELSE NULL END) AS recommended_practice
      SQL
    end

    def rollup_select_columns
      "skill_group_name"
    end

    def select_clause
      <<-SQL
        SELECT
          skill_group_name,
          #{aggregate_by_clause} AS aggregate_id,
          #{aggregate_sort_clause} AS name,
          '#{additional_aggregation}' AS group_by,
          #{specific_select_clause}
      SQL
    end

    def relevant_diagnostic_where_clause
      "AND activities.id = #{diagnostic_id}"
    end

    def group_by_clause
      "GROUP BY aggregate_id, #{aggregate_sort_clause}, skill_group_name"
    end

    def relevant_date_column
      "performance.pre_activity_session_completed_at"
    end

    private def group_sort_by(group)
      group[:skill_group_name]
    end

    private def rollup_aggregation_hash
      {
        pre_students_completed: sum_aggregate,
        post_students_completed: sum_aggregate,
        pre_score: average_aggregate(:pre_students_completed),
        post_score: average_aggregate(:post_students_completed),
        growth_percentage: average_aggregate(:post_students_completed),
        maintained_proficiency: sum_aggregate,
        improved_proficiency: sum_aggregate,
        recommended_practice: sum_aggregate
      }
    end
  end
end
