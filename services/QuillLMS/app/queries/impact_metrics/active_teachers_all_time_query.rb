# frozen_string_literal: true

module ImpactMetrics
  class ActiveTeachersAllTimeQuery < ::QuillBigQuery::Query
    ACTIVITY_SESSION_MINIMUM = 9

    def initialize(options: {})
      super(options)
    end

    def run
      run_query
    end

    def select_clause
      <<-SQL
        SELECT users.id
      SQL
    end

    def where_clause
      ""
    end

    def from_and_join_clauses
      <<-SQL
        FROM lms.users
        JOIN lms.units on units.user_id = users.id
        JOIN lms.classroom_units ON classroom_units.unit_id = units.id
        JOIN lms.activity_sessions ON activity_sessions.classroom_unit_id = classroom_units.id
      SQL
    end

    def group_by_clause
      <<-SQL
        GROUP BY users.id
        HAVING count(activity_sessions) > #{ACTIVITY_SESSION_MINIMUM}
      SQL
    end
  end
end
