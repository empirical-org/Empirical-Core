# frozen_string_literal: true

module Snapshots
  class ActivitiesCompletedQuery < CountQuery
    def select_clause
      "SELECT COUNT(DISTINCT activity_sessions.id) AS count"
    end
  end
end
