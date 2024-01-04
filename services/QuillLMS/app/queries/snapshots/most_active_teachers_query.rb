# frozen_string_literal: true

module Snapshots
  class MostActiveTeachersQuery < ReportingSessionTopXQuery
    def from_and_join_clauses
      super + <<-SQL
        INNER JOIN lms.users
          ON users.id = recent_reporting_sessions.teacher_id
      SQL
    end

    def select_clause
      <<-SQL
        SELECT users.name AS value,
        SUM(recent_reporting_sessions.activity_count) AS count
      SQL
    end

    def group_by_clause
      "GROUP BY recent_reporting_sessions.teacher_id, users.name"
    end
  end
end
