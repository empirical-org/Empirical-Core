# frozen_string_literal: true

module Snapshots
  class TopConceptsAssignedQuery < TopXQuery
    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id
        JOIN lms.activities
          ON unit_activities.activity_id = activities.id
        JOIN lms.concepts
          ON STRING(PARSE_JSON(activities.data).modelConceptUID) = concepts.uid
      SQL
    end

    def where_clause
      # Excluding co-teachers avoids double-counting ClassroomUnits
      super + <<-SQL
        "AND classrooms_teachers.role = #{ClassroomsTeacher.ROLE_TYPES[:owner]}"
      SQL
    end

    def relevant_count_column
      "DISTINCT activity_sessions.id"
    end

    def relevant_date_column
      "classroom_units.created_at"
    end

    def relevant_group_column
      "concepts.name"
    end
  end
end
