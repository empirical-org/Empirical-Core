# frozen_string_literal: true

module Snapshots
  class ActiveTeachersQuery < PeriodQuery
    # This is thee same run clause from CountQuery, but we don't
    # want the additional JOINs in that sub-class, so this class
    # inherits directly from PeriodQuery and copies CountQuery.run
    def run
      {
        'count': run_query.first['count']
      }
    end

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
  end
end
