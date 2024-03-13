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

    def select_clause
      <<-SQL
        SELECT students.id AS student_id,
          COUNT(DISTINCT activity_sessions.id) AS completed_activities,
          SUM(activity_sessions.timespent) AS time_spent_seconds
      SQL
    end

    def from_and_join_clauses
      <<-SQL
        FROM lms.active_classroom_stubs_view AS classrooms
        JOIN lms.classrooms_teachers
          ON classrooms.id = classrooms_teachers.classroom_id
            AND classrooms_teachers.role = 'owner'
        JOIN lms.schools_users
          ON classrooms_teachers.user_id = schools_users.user_id
        JOIN lms.active_classroom_unit_stubs_view AS classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.recommendation_activity_session_stubs_view AS activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN lms.units
          ON classroom_units.unit_id = units.id
        JOIN lms.recommendations
          ON units.unit_template_id = recommendations.unit_template_id
        JOIN lms.active_user_names_view AS students
          ON activity_sessions.user_id = students.id
      SQL
    end

    def group_by_clause
      "GROUP BY students.id, students.name"
    end

    def relevant_date_column = "activity_sessions.completed_at"
    def relevant_diagnostic_where_clause = "AND recommendations.activity_id = #{diagnostic_id}"

    def active_classroom_stubs_view = materialized_view('active_classroom_stubs_view')
    def active_classroom_unit_stubs_view = materialized_view('active_classroom_unit_stubs_view')
    def active_user_names_view = materialized_view('active_user_names_view')
    def recommendation_activity_session_stubs_view = materialized_view('recommendation_activity_session_stubs_view')

    def materialized_views = [recommendation_activity_session_stubs_view, active_classroom_stubs_view, active_classroom_unit_stubs_view, active_user_names_view]

    private def rollup_aggregation_hash
      {
        students_completed_practice: sum_aggregate,
        average_practice_activities_count: average_aggregate(:students_completed_practice),
        average_time_spent_seconds: average_aggregate(:students_completed_practice)
      }
    end

    def contextual_query
      <<-SQL
        SELECT *
          FROM aggregate_rows
      SQL
    end

    def order_by_clause
      <<-SQL
        ORDER BY TRIM(SUBSTR(TRIM(students.name), STRPOS(students.name, ' ') + 1))
      SQL
    end

    def limit_clause
      <<-SQL
        LIMIT 500
      SQL
    end

    private def post_query_transform(results)
      results.to_h do |result|
        [result[:student_id], {completed_activities: result[:completed_activities], time_spent_seconds: result[:time_spent_seconds]}]
      end
    end

    private def valid_aggregation_options
      ['student']
    end

    private def post_process(result)
      result
    end
  end
end
