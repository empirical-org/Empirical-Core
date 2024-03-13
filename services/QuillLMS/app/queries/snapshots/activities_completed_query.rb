# frozen_string_literal: true

module Snapshots
  class ActivitiesCompletedQuery < ReportingSessionCountQuery
    def select_clause
      "SELECT COUNT(DISTINCT session_id) AS count"
    end
  end
end
