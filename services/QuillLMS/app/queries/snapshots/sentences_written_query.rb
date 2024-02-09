# frozen_string_literal: true

module Snapshots
  class SentencesWrittenQuery < ReportingSessionCountQuery
    # The * 1 does nothing, but for some reason,
    # BigQuery uses the BI Query Cache with this present
    # And skips it when it is not
    def select_clause
      "SELECT IFNULL(SUM(question_count * 1), 0) AS count"
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.activities
          ON activity_sessions.activity_id = activities.id
      SQL
    end
  end
end
