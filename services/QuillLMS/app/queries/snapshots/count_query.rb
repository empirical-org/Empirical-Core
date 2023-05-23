# frozen_string_literal: true

module Snapshots
  class CountQuery < PeriodQuery
    def run
      {
        'count': run_query.first['count']
      }
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
      SQL
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end

    def group_by_clause
      "GROUP BY admins.id"
    end
  end
end
