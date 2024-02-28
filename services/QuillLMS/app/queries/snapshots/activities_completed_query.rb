# frozen_string_literal: true

module Snapshots
  class ActivitiesCompletedQuery < ReportingSessionCountQuery
    def select_clause
      "SELECT IFNULL(SUM(activity_count),0) AS count"
    end
  end
end
