# frozen_string_literal: true

module Snapshots
  class MostActiveTeachersQuery < TopXQuery
    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN lms.users
          ON schools_users.user_id = users.id
      SQL
    end

    def relevant_count_column
      "activity_sessions.id"
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end

    def relevant_group_column
      "users.name"
    end
  end
end