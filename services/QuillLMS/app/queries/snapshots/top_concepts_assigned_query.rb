# frozen_string_literal: true

module Snapshots
  class TopConceptsAssignedQuery < TopXQuery
    def query
      <<-SQL
        SELECT value, SUM(count) AS count
          FROM (#{super})
          GROUP BY value
          ORDER BY count DESC
          LIMIT #{NUMBER_OF_RECORDS}
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN (SELECT created_at, classroom_id, unit_id, ARRAY_LENGTH(assigned_student_ids) AS assigned_student_count FROM lms.classroom_units) AS classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id
        JOIN lms.activities
          ON unit_activities.activity_id = activities.id
        JOIN lms.concepts
          ON STRING(PARSE_JSON(activities.data).modelConceptUID) = concepts.uid
      SQL
    end

    def relevant_count_column
      "unit_activities.id"
    end

    def count_clause
      "#{super} * classroom_units.assigned_student_count"
    end

    def group_by_clause
      "#{super}, classroom_units.assigned_student_count"
    end

    def relevant_date_column
      "classroom_units.created_at"
    end

    def relevant_group_column
      "concepts.name"
    end

    # Set to "" here because we want to create an un-LIMITed sub-query
    def limit_clause
      ""
    end
  end
end
