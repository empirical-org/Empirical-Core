# frozen_string_literal: true

module Snapshots
  class MostActiveGradesQuery < ReportingSessionTopXQuery
    NULL_GRADE_LABEL = 'No grade set'

    def select_clause
      <<-SQL
        SELECT IFNULL(CAST(grade AS STRING), '#{NULL_GRADE_LABEL}') AS value,
        SUM(activity_count) AS count
      SQL
    end

    def group_by_clause
      "GROUP BY grade"
    end
  end
end
