# frozen_string_literal: true

module Snapshots
  class TopConceptsAssignedQuery < TopXQuery
    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN lms.activities
          ON activity_sessions.activity_id = activities.id
        JOIN lms.concepts
          ON STRING(PARSE_JSON(activities.data).modelConceptUID) = concepts.uid
      SQL
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end

    def relevant_group_column
      "concepts.name"
    end
  end
end
