# frozen_string_literal: true

module Snapshots
  class MostActiveGradesQuery < ReportingSessionTopXQuery
    NULL_GRADE_LABEL = 'No grade set'

    def select_clause
      <<-SQL
        SELECT IFNULL(CAST(grade AS STRING), '#{NULL_GRADE_LABEL}') AS value,
        IFNULL(SUM(activity_count),0) AS count
      SQL
    end

    def group_by_clause
      "GROUP BY grade"
    end
  end
end
