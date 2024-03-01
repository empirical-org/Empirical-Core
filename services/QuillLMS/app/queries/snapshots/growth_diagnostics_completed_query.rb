# frozen_string_literal: true

module Snapshots
  class GrowthDiagnosticsCompletedQuery < ReportingSessionCountQuery
    GROWTH_DIAGNOSTIC_IDS = Activity.where(id: Activity::PRE_TEST_DIAGNOSTIC_IDS).pluck(:follow_up_activity_id)

    def select_clause
      "SELECT COUNT(DISTINCT session_id) AS count"
    end

    def where_clause
      super + <<-SQL
        AND activity_id IN (#{GROWTH_DIAGNOSTIC_IDS.join(',')})
      SQL
    end
  end
end
