# frozen_string_literal: true

module Snapshots
  class MostActiveTeachersQuery < ReportingSessionTopXQuery
    def select_clause
      <<-SQL
        SELECT teacher_name AS value,
        COUNT(DISTINCT session_id) AS count
      SQL
    end

    def group_by_clause
      "GROUP BY teacher_id, teacher_name"
    end
  end
end
