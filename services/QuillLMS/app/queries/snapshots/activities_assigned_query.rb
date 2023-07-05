# frozen_string_literal: true

module Snapshots
  class ActivitiesAssignedQuery < CountQuery
    def query
      <<-SQL
        SELECT IFNULL(SUM(assigned_count), 0) AS count
          FROM (#{super})
      SQL
    end

    def select_clause
      "SELECT DISTINCT unit_activities.id, ARRAY_LENGTH(classroom_units.assigned_student_ids) AS assigned_count"
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id
      SQL
    end

    def relevant_date_column
      "classroom_units.created_at"
    end
  end
end
