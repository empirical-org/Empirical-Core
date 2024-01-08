# frozen_string_literal: true

module Snapshots
  class BaselineDiagnosticsCompletedQuery < ReportingSessionCountQuery
    BASELINE_DIAGNOSTIC_IDS = Activity::PRE_TEST_DIAGNOSTIC_IDS

    def select_clause
      "SELECT SUM(activity_count) AS count"
    end

    def where_clause
      super + <<-SQL
        AND activity_id IN (#{BASELINE_DIAGNOSTIC_IDS.join(',')})
      SQL
    end
  end
end
