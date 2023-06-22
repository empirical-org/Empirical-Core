# frozen_string_literal: true

module Snapshots
  class ActivityPacksCompletedQuery < ActivitySessionCountQuery
    def query
      <<-SQL
        SELECT COUNTIF(activities_complete = activities_in_pack) AS count
          FROM (#{super})
      SQL
    end

    def select_clause
      "SELECT classroom_units.id, activity_sessions.user_id, COUNT(DISTINCT activity_sessions.activity_id) AS activities_complete, COUNT(DISTINCT unit_activities.activity_id) AS activities_in_pack"
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id
      SQL
    end

    def group_by_clause
      "GROUP BY classroom_units.id, activity_sessions.user_id"
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end
  end
end
