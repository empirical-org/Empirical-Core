# frozen_string_literal: true

module AdminDiagnosticReports
  class StudentCountByFilterScopeQuery < ::QuillBigQuery::MaterializedViewQuery
    class InvalidDiagnosticIdError < StandardError; end

    attr_reader :timeframe_start, :timeframe_end, :school_ids, :grades, :teacher_ids, :classroom_ids, :user, :additional_aggregation, :diagnostic_id

    DIAGNOSTIC_ORDER_BY_ID = [
      1663, # Starter Baseline Diagnostic (Pre)
      1668, # Intermediate Baseline Diagnostic (Pre)
      1678, # Advanced Baseline Diagnostic (Pre)
      1161, # ELL Starter Baseline Diagnostic (Pre)
      1568, # ELL Intermediate Baseline Diagnostic (Pre)
      1590, # ELL Advanced Baseline Diagnostic (Pre)
      992,  # AP Writing Skills Survey
      1229, #  Pre-AP Writing Skills Survey 1
      1230, # Pre-AP Writing Skills Survey 2
      1432  # SpringBoard Writing Skills Survey
    ]

    def initialize(timeframe_start:, timeframe_end:, diagnostic_id:, school_ids:, grades: nil, teacher_ids: nil, classroom_ids: nil, user: nil, **options) # rubocop:disable Metrics/ParameterLists
      raise InvalidDiagnosticIdError, "#{diagnostic_id} is not a valid diagnostic_id value." unless DIAGNOSTIC_ORDER_BY_ID.include?(diagnostic_id.to_i)

      @timeframe_start = timeframe_start
      @timeframe_end = timeframe_end
      @school_ids = school_ids
      @grades = grades
      @teacher_ids = teacher_ids
      @classroom_ids = classroom_ids
      @user = user
      @diagnostic_id = diagnostic_id

      super(**options)
    end

    def materialized_views = [active_classroom_stubs_view, performance_view]

    def active_classroom_stubs_view = materialized_view('active_classroom_stubs_view')
    def performance_view = materialized_view('pre_post_diagnostic_skill_group_performance_view')

    def run = {count: run_query.first[:count]}

    def select_clause = "SELECT COUNT(DISTINCT student_id) AS count"

    def from_and_join_clauses
      # NOTE: This implementation does not use super, and overrides the base query entirely in order to use materialized views
      <<-SQL
        FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.active_classroom_stubs_view AS classrooms ON performance.classroom_id = classrooms.id
        JOIN lms.classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.role = 'owner'
        JOIN lms.schools_users ON classrooms_teachers.user_id = schools_users.user_id
        JOIN lms.schools ON schools_users.school_id = schools.id
      SQL
    end

    def where_clause
      <<-SQL
        WHERE #{timeframe_where_clause}
          #{classroom_ids_where_clause}
          #{grades_where_clause}
          #{owner_teachers_only_where_clause}
          #{relevant_diagnostic_where_clause}
          #{school_ids_where_clause}
          #{teacher_ids_where_clause}
          AND performance.activity_id = #{diagnostic_id}
      SQL
    end

    def timeframe_where_clause = "#{relevant_date_column} BETWEEN '#{timeframe_start.to_fs(:db)}' AND '#{timeframe_end.to_fs(:db)}'"
    def classroom_ids_where_clause = ("AND classrooms.id IN (#{classroom_ids.join(',')})" if classroom_ids.present?)
    def grades_where_clause = ("AND (classrooms.grade IN (#{grades.map { |g| "'#{g}'" }.join(',')}) #{grades_where_null_clause})" if grades.present?)
    def grades_where_null_clause = ("OR classrooms.grade IS NULL" if grades.include?('null'))
    def owner_teachers_only_where_clause = "AND classrooms_teachers.role = '#{ClassroomsTeacher::ROLE_TYPES[:owner]}'"
    def relevant_diagnostic_where_clause = "AND performance.activity_id IN (#{DIAGNOSTIC_ORDER_BY_ID.join(',')})"
    def school_ids_where_clause = "AND schools_users.school_id IN (#{school_ids.join(',')})"
    def teacher_ids_where_clause = ("AND schools_users.user_id IN (#{teacher_ids.join(',')})" if teacher_ids.present?)

    def relevant_date_column = "performance.pre_assigned_at"
  end
end
