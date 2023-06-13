# frozen_string_literal: true

module Snapshots
  class AverageActivitiesCompletedPerStudentQuery < ActivitySessionCountQuery
    def select_clause
      # "greatest" avoids division by 0 error
      "SELECT COUNT(DISTINCT activity_sessions.id) / greatest(COUNT(DISTINCT activity_sessions.user_id), 1) AS count"
    end
  end
end
