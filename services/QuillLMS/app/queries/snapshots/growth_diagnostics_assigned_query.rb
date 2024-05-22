# frozen_string_literal: true

module Snapshots
  class GrowthDiagnosticsAssignedQuery < CountQuery
    GROWTH_DIAGNOSTIC_IDS = Activity.where(id: Activity::PRE_TEST_DIAGNOSTIC_IDS).pluck(:follow_up_activity_id)

    def query
      <<-SQL
        SELECT IFNULL(SUM(students_assigned), 0) AS count
          FROM (#{super})
      SQL
    end

    def select_clause
      "SELECT DISTINCT classroom_units.id, ARRAY_LENGTH(assigned_student_ids) AS students_assigned"
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id
      SQL
    end

    def where_clause
      super + <<-SQL
        AND unit_activities.activity_id IN (#{GROWTH_DIAGNOSTIC_IDS.join(',')})
      SQL
    end

    def relevant_date_column
      "classroom_units.created_at"
    end
  end
end
