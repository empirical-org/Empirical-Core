# frozen_string_literal: true

module Snapshots
  class ActiveClassroomsQuery < ReportingSessionCountQuery
    def select_clause
      "SELECT COUNT(DISTINCT classroom_id) AS count"
    end
  end
end
