# frozen_string_literal: true

module Snapshots
  class MostCompletedActivitiesQuery < ReportingSessionTopXQuery

    def select_clause
      <<-SQL
        SELECT activity_name AS value,
        COUNT(DISTINCT session_id) AS count
      SQL
    end

    def group_by_clause
      "GROUP BY activity_id, activity_name"
    end
  end
end
