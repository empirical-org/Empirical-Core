# frozen_string_literal: true

module Snapshots
  class TeacherAccountsCreatedQuery < CountQuery
    def select_clause
      "SELECT COUNT(DISTINCT users.id) AS count"
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.users
          ON schools_users.user_id = users.id
      SQL
    end

    def relevant_date_column
      "users.created_at"
    end

    # For this query we want to count all teachers, not just classroom owners
    def owner_teachers_only_where_clause
      ""
    end
  end
end
