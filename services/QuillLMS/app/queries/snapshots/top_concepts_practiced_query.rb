# frozen_string_literal: true

module Snapshots
  class TopConceptsPracticedQuery < ReportingSessionTopXQuery
    def from_and_join_clauses
      super + <<-SQL
        INNER JOIN lms.activity_category_activities
          ON #{reporting_sessions_view.name}.activity_id = activity_category_activities.activity_id
        INNER JOIN lms.activity_categories
          ON activity_category_activities.activity_category_id = activity_categories.id
      SQL
    end

    def select_clause
      <<-SQL
        SELECT activity_categories.name as value,
        COUNT(DISTINCT #{reporting_sessions_view.name}.session_id) AS count
      SQL
    end

    def group_by_clause
      'GROUP BY activity_categories.id, activity_categories.name'
    end
  end
end
