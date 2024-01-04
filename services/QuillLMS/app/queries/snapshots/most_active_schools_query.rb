# frozen_string_literal: true

module Snapshots
  class MostActiveSchoolsQuery < ReportingSessionTopXQuery
    def from_and_join_clauses
      super + <<-SQL
        INNER JOIN lms.schools ON recent_reporting_sessions.school_id = schools.id
      SQL
    end

    def select_clause
      <<~SQL
        SELECT schools.name AS value,
        SUM(recent_reporting_sessions.activity_count) AS count
      SQL
    end

    def group_by_clause
      "GROUP BY recent_reporting_sessions.school_id, schools.name"
    end
  end
end
