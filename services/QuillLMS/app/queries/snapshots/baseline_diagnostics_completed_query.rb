# frozen_string_literal: true

module Snapshots
  class BaselineDiagnosticsCompletedQuery < ActivitySessionCountQuery
    BASELINE_DIAGNOSTIC_IDS = Activity::PRE_TEST_DIAGNOSTIC_IDS

    def select_clause
      "SELECT COUNT(DISTINCT activity_sessions.id) AS count"
    end

    def where_clause
      super + <<-SQL
        AND activity_sessions.activity_id IN (#{BASELINE_DIAGNOSTIC_IDS.join(',')})
      SQL
    end
  end
end
