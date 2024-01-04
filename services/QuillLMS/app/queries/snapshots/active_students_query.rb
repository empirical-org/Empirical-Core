# frozen_string_literal: true

module Snapshots
  class ActiveStudentsQuery < ReportingSessionCountQuery
    def select_clause
      "SELECT COUNT(DISTINCT recent_reporting_sessions.student_id) AS count"
    end
  end
end
