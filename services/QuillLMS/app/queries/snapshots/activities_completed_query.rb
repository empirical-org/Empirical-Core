# frozen_string_literal: true

module Snapshots
  class ActivitiesCompletedQuery < ActivitySessionCountQuery
    def select_clause
      "SELECT COUNT(DISTINCT activity_sessions.id) AS count"
    end

    def limit_clause
      "LIMIT 10"
    end
  end
end
