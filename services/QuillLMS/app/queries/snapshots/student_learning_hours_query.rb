# frozen_string_literal: true

module Snapshots
  class StudentLearningHoursQuery < ActivitySessionCountQuery
    def select_clause
      # timespent stores seconds
      "SELECT IFNULL(SUM(activity_sessions.timespent), 0) / 3600.0 AS count"
    end
  end
end
