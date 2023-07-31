# frozen_string_literal: true

module Snapshots
  class MostActiveGradesQuery < TopXQuery
    NULL_GRADE_LABEL = 'No grade set'

    def select_clause
      <<-SQL
        SELECT IFNULL(CAST(#{relevant_group_column} AS STRING), '#{NULL_GRADE_LABEL}') AS value, #{count_clause} AS count
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
      SQL
    end

    def relevant_count_column
      "activity_sessions.id"
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end

    def relevant_group_column
      "classrooms.grade"
    end
  end
end
