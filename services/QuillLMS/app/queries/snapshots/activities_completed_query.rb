# frozen_string_literal: true

module Snapshots
  class ActivitiesCompletedQuery < ReportingSessionCountQuery
    include QuillBigQuery::MaterializedViewable

    def select_clause
      "SELECT SUM(activity_count) AS count"
    end
  end
end
