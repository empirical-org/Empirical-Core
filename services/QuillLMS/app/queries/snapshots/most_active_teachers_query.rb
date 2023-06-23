# frozen_string_literal: true

module Snapshots
  class MostActiveTeachersQuery < TopXQuery
    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.schools_users
          ON schools.id = schools_users.school_id
        JOIN lms.classrooms_units
          ON classrooms.id = classrooms_units.classroom_id
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
      SQL
    end

    def relevant_count_column
      "activity_sessions.id"
    end

    def relevant_date_column
      "activity_session.completed_at"
    end

    def relevant_group_column
      "schools_users.user_id"
    end
  end
end
