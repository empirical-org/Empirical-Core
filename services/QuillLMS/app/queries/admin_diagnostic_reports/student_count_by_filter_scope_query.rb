# frozen_string_literal: true

module AdminDiagnosticReports
  class StudentCountByFilterScopeQuery < ::Snapshots::CountQuery
    class InvalidDiagnosticIdError < StandardError; end

    attr_reader :diagnostic_id

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

    def initialize(diagnostic_id:, **options)
      raise InvalidDiagnosticIdError, "#{diagnostic_id} is not a valid diagnostic_id value." unless DIAGNOSTIC_ORDER_BY_ID.include?(diagnostic_id.to_i)

      @diagnostic_id = diagnostic_id

      super(**options)
    end

    def select_clause
      "SELECT COUNT(DISTINCT student_id) AS count"
    end

    def from_and_join_clauses
      # NOTE: This implementation does not use super, and overrides the base query entirely in order to use materialized views
      <<-SQL
        FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.classrooms ON performance.classroom_id = classrooms.id
        JOIN lms.classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.role = 'owner'
        JOIN lms.schools_users ON classrooms_teachers.user_id = schools_users.user_id
        JOIN lms.schools ON schools_users.school_id = schools.id
      SQL
    end

    def where_clause
      <<-SQL
        #{super}
          AND performance.activity_id = #{diagnostic_id}
      SQL
    end

    def relevant_date_column
      "performance.pre_assigned_at"
    end
  end
end
