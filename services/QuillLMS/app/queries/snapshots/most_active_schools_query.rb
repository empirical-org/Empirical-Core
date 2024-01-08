# frozen_string_literal: true

module Snapshots
  class MostActiveSchoolsQuery < ReportingSessionTopXQuery

    def select_clause
      <<~SQL
        SELECT school_name AS value,
        SUM(activity_count) AS count
      SQL
    end

    def group_by_clause
      "GROUP BY school_id, school_name"
    end
  end
end
