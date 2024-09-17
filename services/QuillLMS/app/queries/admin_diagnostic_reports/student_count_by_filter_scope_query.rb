# frozen_string_literal: true

module AdminDiagnosticReports
  class StudentCountByFilterScopeQuery < ::QuillBigQuery::MaterializedViewQuery
    class InvalidDiagnosticIdError < StandardError; end

    attr_reader :timeframe_start, :timeframe_end, :school_ids, :grades, :teacher_ids, :classroom_ids, :user, :additional_aggregation, :diagnostic_id

    DIAGNOSTIC_ORDER_BY_ID = DiagnosticAggregateQuery::DIAGNOSTIC_ORDER_BY_ID

    def initialize(timeframe_start:, timeframe_end:, diagnostic_id:, school_ids:, grades: nil, teacher_ids: nil, classroom_ids: nil, user: nil, **) # rubocop:disable Metrics/ParameterLists
      raise InvalidDiagnosticIdError, "#{diagnostic_id} is not a valid diagnostic_id value." unless DIAGNOSTIC_ORDER_BY_ID.include?(diagnostic_id.to_i)

      @timeframe_start = timeframe_start
      @timeframe_end = timeframe_end
      @school_ids = school_ids
      @grades = grades
      @teacher_ids = teacher_ids
      @classroom_ids = classroom_ids
      @user = user
      @diagnostic_id = diagnostic_id

      super(**)
    end

    def materialized_views = [filter_view, performance_view]

    def filter_view = materialized_view('school_classroom_teachers_view')
    def performance_view = materialized_view('pre_post_diagnostic_skill_group_performance_view')

    def run = { count: run_query.first[:count] }

    def select_clause = "SELECT COUNT(DISTINCT CONCAT(performance.classroom_id, ':', performance.student_id)) AS count"

    def from_and_join_clauses
      # NOTE: This implementation does not use super, and overrides the base query entirely in order to use materialized views
      <<-SQL
        FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.school_classroom_teachers_view AS filter ON performance.classroom_id = filter.classroom_id
      SQL
    end

    def where_clause
      <<-SQL
        WHERE #{timeframe_where_clause}
          #{classroom_ids_where_clause}
          #{grades_where_clause}
          #{relevant_diagnostic_where_clause}
          #{school_ids_where_clause}
          #{teacher_ids_where_clause}
          AND performance.activity_id = #{diagnostic_id}
      SQL
    end

    def timeframe_where_clause = "#{relevant_date_column} BETWEEN '#{timeframe_start.to_fs(:db)}' AND '#{timeframe_end.to_fs(:db)}'"
    def classroom_ids_where_clause = ("AND filter.classroom_id IN (#{classroom_ids.join(',')})" if classroom_ids.present?)
    def grades_where_clause = ("AND (filter.grade IN (#{grades.map { |g| "'#{g}'" }.join(',')}) #{grades_where_null_clause})" if grades.present?)
    def grades_where_null_clause = ('OR filter.grade IS NULL' if grades.include?('null'))
    def relevant_diagnostic_where_clause = "AND performance.activity_id IN (#{DIAGNOSTIC_ORDER_BY_ID.join(',')})"
    def school_ids_where_clause = "AND filter.school_id IN (#{school_ids.join(',')})"
    def teacher_ids_where_clause = ("AND filter.teacher_id IN (#{teacher_ids.join(',')})" if teacher_ids.present?)

    def relevant_date_column = 'performance.pre_assigned_at'
  end
end
