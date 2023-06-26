# frozen_string_literal: true

module Snapshots
  class StudentAccountsCreatedQuery < CountQuery
    def select_clause
      "SELECT COUNT(DISTINCT users.id) AS count"
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.students_classrooms
          ON classrooms.id = students_classrooms.classroom_id
        JOIN lms.users
          ON students_classrooms.student_id = users.id
      SQL
    end

    def relevant_date_column
      "users.created_at"
    end
  end
end
