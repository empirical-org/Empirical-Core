# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticRecommendationsByStudentQuery < DiagnosticAggregateViewQuery
    class InvalidDiagnosticIdError < StandardError; end

    attr_reader :diagnostic_id

    def initialize(diagnostic_id:, **options)
      raise InvalidDiagnosticIdError, "#{diagnostic_id} is not a valid diagnostic_id value." unless DIAGNOSTIC_ORDER_BY_ID.include?(diagnostic_id.to_i)

      @diagnostic_id = diagnostic_id

      super(aggregation: 'student', **options)
    end

    def materialized_views = [recommendation_count_rollup_view, active_user_names_view]

    def active_user_names_view = materialized_view('active_user_names_view')
    def recommendation_count_rollup_view = materialized_view('recommendation_count_rollup_view')

    def select_clause
      <<-SQL
        SELECT user_id AS student_id,
          completed_activities,
          time_spent_seconds
      SQL
    end

    def from_and_join_clauses
      <<-SQL
        FROM lms.recommendation_count_rollup_view
        JOIN lms.active_user_names_view AS students
          ON recommendation_count_rollup_view.user_id = students.id
      SQL
    end

    def where_clause
      <<-SQL
        #{super}
        #{relevant_diagnostic_where_clause}
      SQL
    end

    def classroom_ids_where_clause = ("AND classroom_id IN (#{classroom_ids.join(',')})" if classroom_ids.present?)
    def grades_where_clause = ("AND (grade IN (#{grades.map { |g| "'#{g}'" }.join(',')}) #{grades_where_null_clause})" if grades.present?)
    def grades_where_null_clause = ("OR grade IS NULL" if grades.include?('null'))
    def school_ids_where_clause = "AND school_id IN (#{school_ids.join(',')})"
    def teacher_ids_where_clause = ("AND teacher_id IN (#{teacher_ids.join(',')})" if teacher_ids.present?)
    def relevant_diagnostic_where_clause = "AND activity_id = #{diagnostic_id}"

    def group_by_clause = ""
    def order_by_clause = "ORDER BY TRIM(SUBSTR(TRIM(students.name), STRPOS(students.name, ' ') + 1))"
    def limit_clause = "LIMIT 500"

    def relevant_date_column = "pre_diagnostic_completed_at"

    def query = root_query

    private def post_query_transform(results)
      results.to_h do |result|
        [result[:student_id], {completed_activities: result[:completed_activities], time_spent_seconds: result[:time_spent_seconds]}]
      end
    end

    private def valid_aggregation_options = ['student']
    private def post_process(result) = result
  end
end
