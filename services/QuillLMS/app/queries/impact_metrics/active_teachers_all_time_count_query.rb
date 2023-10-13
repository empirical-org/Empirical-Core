# frozen_string_literal: true

module ImpactMetrics
  class ActiveTeachersAllTimeCountQuery < ::QuillBigQuery::Query
    ACTIVITY_SESSION_MINIMUM = 9

    def run
      run_query
    end

    def select_clause
      <<-SQL
        SELECT count(*) as count FROM (
          SELECT users.id
          FROM lms.users
          JOIN lms.units on units.user_id = users.id
          JOIN lms.classroom_units ON classroom_units.unit_id = units.id
          JOIN lms.activity_sessions ON activity_sessions.classroom_unit_id = classroom_units.id
          GROUP BY users.id
          HAVING count(activity_sessions) > #{ACTIVITY_SESSION_MINIMUM}
        )
      SQL
    end

    def from_and_join_clauses; ''; end
    def where_clause; ''; end
  end
end
