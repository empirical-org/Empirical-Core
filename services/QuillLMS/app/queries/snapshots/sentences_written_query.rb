# frozen_string_literal: true

module Snapshots
  class SentencesWrittenQuery < ReportingSessionCountQuery
    # The * 1 does nothing, but for some reason,
    # BigQuery uses the BI Query Cache with this present
    # And skips it when it is not
    def select_clause
      "SELECT IFNULL(SUM(question_count * 1), 0) AS count"
    end
  end
end
