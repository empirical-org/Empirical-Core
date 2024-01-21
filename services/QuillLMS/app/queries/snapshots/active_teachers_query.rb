# frozen_string_literal: true

module Snapshots
  class ActiveTeachersQuery < CountQuery
    def select_clause
      "SELECT COUNT(DISTINCT users.id) AS count"
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.users
          ON schools_users.user_id = users.id
        JOIN lms.user_logins
          ON users.id = user_logins.user_id
      SQL
    end

    def relevant_date_column
      "user_logins.created_at"
    end

    # For this query we want to count all teachers, not just classroom owners
    def owner_teachers_only_where_clause
      ""
    end
  end
end
