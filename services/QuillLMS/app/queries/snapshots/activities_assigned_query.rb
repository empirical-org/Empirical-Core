# frozen_string_literal: true

module Snapshots
  class ActivitiesAssignedQuery < CountQuery
    def query
      <<-SQL
        SELECT SUM(sub_query.activities_assigned) AS count
          FROM (
            SELECT (sub_sub_query.students_assigned_count * COUNT(unit_activities.unit_id)) AS activities_assigned
            FROM (#{super}) AS sub_sub_query
            JOIN lms.unit_activities
              ON sub_sub_query.unit_id = unit_activities.unit_id
            GROUP BY sub_sub_query.id,
              sub_sub_query.students_assigned_count,
              unit_activities.unit_id
          ) AS sub_query
      SQL
    end

    def select_clause
      <<-SQL
        SELECT
          DISTINCT classroom_units.id,
          classroom_units.unit_id,
          array_length(classroom_units.assigned_student_ids) AS students_assigned_count
      SQL
    end

    def relevant_date_column
      "classroom_units.created_at"
    end
  end
end
