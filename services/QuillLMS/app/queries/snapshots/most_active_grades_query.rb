# frozen_string_literal: true

module Snapshots
  class MostActiveGradesQuery < ReportingSessionTopXQuery
    NULL_GRADE_LABEL = 'No grade set'

    def select_clause
      <<-SQL
        SELECT IFNULL(CAST(recent_reporting_sessions.grade AS STRING), '#{NULL_GRADE_LABEL}') AS value,
        SUM(recent_reporting_sessions.activity_count) AS count
      SQL
    end

    def group_by_clause
      "GROUP BY recent_reporting_sessions.grade"
    end
  end
end
