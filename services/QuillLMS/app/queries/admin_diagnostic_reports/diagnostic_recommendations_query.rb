# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticRecommendationsQuery < DiagnosticAggregateViewQuery
    def select_clause
      <<-SQL
        SELECT
          activity_id AS diagnostic_id,
          activity_name AS diagnostic_name,
          #{aggregate_by_clause} AS aggregate_id,
          #{aggregate_sort_clause} AS name,
          '#{additional_aggregation}' AS group_by,
          #{specific_select_clause}
      SQL
    end

    def specific_select_clause
      <<-SQL
          COUNT(DISTINCT CONCAT(classroom_id, ':', user_id)) AS students_completed_practice,
          SAFE_DIVIDE(SUM(completed_activities), COUNT(DISTINCT CONCAT(classroom_id, ':', user_id))) AS average_practice_activities_count,
          SAFE_DIVIDE(SUM(time_spent_seconds), COUNT(DISTINCT CONCAT(classroom_id, ':', user_id))) AS average_time_spent_seconds
      SQL
    end

    def from_and_join_clauses
      <<-SQL
        FROM lms.recommendation_count_rollup_view
      SQL
    end

    def where_clause
      <<-SQL
        WHERE
          #{timeframe_where_clause}
          #{classroom_ids_where_clause}
          #{grades_where_clause}
          #{relevant_diagnostic_where_clause}
          #{school_ids_where_clause}
          #{teacher_ids_where_clause}
      SQL
    end

    def classroom_ids_where_clause = ("AND classroom_id IN (#{classroom_ids.join(',')})" if classroom_ids.present?)
    def grades_where_clause = ("AND (grade IN (#{grades.map { |g| "'#{g}'" }.join(',')}) #{grades_where_null_clause})" if grades.present?)
    def grades_where_null_clause = ("OR grade IS NULL" if grades.include?('null'))
    def relevant_diagnostic_where_clause = "AND activity_id IN (#{DIAGNOSTIC_ORDER_BY_ID.join(',')})"
    def school_ids_where_clause = "AND school_id IN (#{school_ids.join(',')})"
    def teacher_ids_where_clause = ("AND teacher_id IN (#{teacher_ids.join(',')})" if teacher_ids.present?)

    def group_by_clause = "GROUP BY activity_id, activity_name, aggregate_id, #{aggregate_sort_clause}"

    def relevant_date_column
      "pre_diagnostic_completed_at"
    end

    def recommendation_view = materialized_view('recommendation_count_rollup_view')

    def materialized_views = [recommendation_view]

    def aggregate_by_clause
      {
        'grade' => "grade",
        'classroom' => "classroom_id",
        'teacher' => "teacher_id",
        'student' => "CONCAT(classroom_id, ':', user_id)"
      }.fetch(additional_aggregation)
    end

    def aggregate_sort_clause
      {
        'grade' => "grade",
        'classroom' => "classroom_name",
        'teacher' => "teacher_name",
        'student' => "user_id"
      }.fetch(additional_aggregation)
    end

    private def rollup_aggregation_hash
      {
        students_completed_practice: sum_aggregate,
        average_practice_activities_count: average_aggregate(:students_completed_practice),
        average_time_spent_seconds: average_aggregate(:students_completed_practice)
      }
    end
  end
end
