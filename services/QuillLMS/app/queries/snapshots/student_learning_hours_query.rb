# frozen_string_literal: true

module Snapshots
  class StudentLearningHoursQuery < ReportingSessionCountQuery
    def select_clause
      "SELECT IFNULL(SUM(recent_reporting_sessions.time_spent), 0) / 3600.0 AS count"
    end
  end
end
