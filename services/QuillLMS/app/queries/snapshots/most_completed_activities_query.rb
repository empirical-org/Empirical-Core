# frozen_string_literal: true

module Snapshots
  class MostCompletedActivitiesQuery < ReportingSessionTopXQuery
    def from_and_join_clauses
      super + <<-SQL
        INNER JOIN lms.activities
          ON activities.id = recent_reporting_sessions.activity_id
      SQL
    end

    def select_clause
      <<-SQL
        SELECT activities.name AS value,
        SUM(recent_reporting_sessions.activity_count) AS count
      SQL
    end

    def group_by_clause
      "GROUP BY recent_reporting_sessions.activity_id, activities.name"
    end
  end
end
