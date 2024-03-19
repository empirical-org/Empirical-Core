# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticPerformanceByStudentViewQuery < DiagnosticAggregateViewQuery
    class InvalidDiagnosticIdError < StandardError; end

    attr_reader :diagnostic_id

    AGGREGATE_COLUMN = :student_id

    def initialize(diagnostic_id:, **options)
      raise InvalidDiagnosticIdError, "#{diagnostic_id} is not a valid diagnostic_id value." unless DIAGNOSTIC_ORDER_BY_ID.include?(diagnostic_id.to_i)

      @diagnostic_id = diagnostic_id

      super(aggregation: 'student', **options)
    end

    def rollup_select_columns = "student_id, student_name, pre_activity_session_completed_at, post_activity_session_completed_at, classroom_id"

    def specific_select_clause
      <<-SQL
        CASE WHEN performance.pre_questions_correct < performance.post_questions_correct THEN 1 ELSE 0 END AS pre_to_post_improved_skill_count,
        performance.pre_questions_correct AS pre_questions_correct,
        performance.pre_questions_total AS pre_questions_total,
        SAFE_DIVIDE(CAST(performance.pre_questions_correct AS float64), performance.pre_questions_total) AS pre_questions_percentage,
        performance.post_questions_correct AS post_questions_correct,
        performance.post_questions_total AS post_questions_total,
        SAFE_DIVIDE(CAST(performance.post_questions_correct AS float64), performance.post_questions_total) AS post_questions_percentage,
        1 AS total_skills,
        CASE WHEN performance.pre_questions_correct = performance.pre_questions_total THEN 1 ELSE 0 END AS pre_skills_proficient,
        CASE WHEN performance.pre_questions_correct = performance.pre_questions_total THEN 0 ELSE 1 END AS pre_skills_to_practice,
        CASE WHEN performance.post_questions_correct < performance.post_questions_total AND performance.post_questions_correct <= performance.pre_questions_correct THEN 1 ELSE 0 END post_skills_to_practice,
        CASE WHEN performance.post_questions_correct > performance.pre_questions_correct THEN 1 ELSE 0 END AS post_skills_improved,
        CASE WHEN performance.post_questions_correct = performance.pre_questions_correct AND performance.post_questions_correct = performance.post_questions_total THEN 1 ELSE 0 END post_skills_maintained,
        CASE WHEN performance.post_questions_correct > performance.pre_questions_correct OR (performance.post_questions_correct = performance.pre_questions_correct AND performance.post_questions_correct = performance.post_questions_total) THEN 1 ELSE 0 END post_skills_improved_or_maintained
      SQL
    end

    def from_and_join_clauses
      <<-SQL
        #{super}
        JOIN lms.active_user_names_view AS students ON performance.student_id = students.id
      SQL
    end

    def select_clause
      <<-SQL
        SELECT
          students.id AS student_id,
          students.name AS student_name,
          performance.pre_activity_session_completed_at,
          performance.post_activity_session_completed_at,
          performance.classroom_id,
          #{aggregate_by_clause} AS aggregate_id,
          #{aggregate_sort_clause} AS name,
          '#{additional_aggregation}' AS group_by,
          performance.skill_group_name AS skill_group_name,
          #{specific_select_clause}
      SQL
    end

    def relevant_diagnostic_where_clause = "AND performance.activity_id = #{diagnostic_id}"

    def group_by_clause
      <<-SQL
      GROUP BY skill_group_name,
        aggregate_id,
        #{aggregate_sort_clause},
        student_id,
        pre_activity_session_completed_at,
        post_activity_session_completed_at,
        performance.classroom_id,
        performance.pre_questions_correct,
        performance.pre_questions_total,
        performance.post_questions_correct,
        performance.post_questions_total
      SQL
    end

    def order_by_clause = "ORDER BY TRIM(SUBSTR(TRIM(student_name), STRPOS(student_name, ' ') + 1)), student_name, student_id, skill_group_name"
    def limit_clause = " LIMIT 5000"

    def relevant_date_column = "performance.pre_assigned_at"

    def aggregate_by_clause = "CONCAT(performance.classroom_id, ' ', performance.student_id)"
    def aggregate_sort_clause = "students.name"

    private def post_process(result)
      # This is an override of the base post_process without a Ruby-based
      # sorting call at the end since we're using ORDER BY in the SQL
      return [] if result.empty?

      result.group_by { |row| "#{row[:classroom_id]}:#{row[self.class::AGGREGATE_COLUMN]}" }
        .values
        .map { |group_rows| build_diagnostic_aggregates(group_rows) }
    end

    private def valid_aggregation_options = ['student']

    private def rollup_aggregation_hash
      {
        skill_group_name: static_string("ROLLUP"),
        pre_to_post_improved_skill_count: sum_aggregate,
        pre_questions_correct: sum_aggregate,
        pre_questions_total: sum_aggregate,
        pre_questions_percentage: naive_average_aggregate,
        post_questions_correct: sum_aggregate,
        post_questions_total: sum_aggregate,
        post_questions_percentage: naive_average_aggregate,
        total_skills: sum_aggregate,
        pre_skills_proficient: sum_aggregate,
        pre_skills_to_practice: sum_aggregate,
        post_skills_to_practice: sum_aggregate,
        post_skills_improved: sum_aggregate,
        post_skills_maintained: sum_aggregate,
        post_skills_improved_or_maintained: sum_aggregate
      }
    end
  end
end
