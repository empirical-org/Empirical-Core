# frozen_string_literal: true

module Snapshots
  class TeachersOptionsQuery < OptionsQuery
    def select_clause
      "SELECT DISTINCT teachers.id, teachers.name"
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.users AS teachers
          ON schools_users.user_id = teachers.id
      SQL
    end

    private def order_by_column
      "teachers.name"
    end
  end
end
