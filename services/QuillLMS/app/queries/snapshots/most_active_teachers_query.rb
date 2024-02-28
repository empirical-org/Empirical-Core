# frozen_string_literal: true

module Snapshots
  class MostActiveTeachersQuery < ReportingSessionTopXQuery
    def select_clause
      <<-SQL
        SELECT teacher_name AS value,
        IFNULL(SUM(activity_count),0) AS count
      SQL
    end

    def group_by_clause
      "GROUP BY teacher_id, teacher_name"
    end
  end
end
