# frozen_string_literal: true

module Snapshots
  class AverageActivitiesCompletedPerStudentQuery < CountQuery
    def select_clause
      "SELECT COUNT(DISTINCT activity_sessions.id) / COUNT(DISTINCT activity_sessions.user_id) AS count"
    end
  end
end
