# frozen_string_literal: true

module Snapshots
  class ActiveStudentsQuery < ReportingSessionCountQuery
    def select_clause
      "SELECT COUNT(DISTINCT student_id) AS count"
    end
  end
end
