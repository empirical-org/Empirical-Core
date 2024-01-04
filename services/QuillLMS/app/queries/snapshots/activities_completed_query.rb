# frozen_string_literal: true

module Snapshots
  class ActivitiesCompletedQuery < ReportingSessionCountQuery
    def select_clause
      "SELECT SUM(recent_reporting_sessions.activity_count) AS count"
    end
  end
end
