# frozen_string_literal: true

module ImpactMetrics
  class ActivitiesAllTimeQuery < ::QuillBigQuery::Query

    def initialize(options)
      super(**options)
    end

    def run
      run_query
    end

    def select_clause
      <<-SQL
        SELECT COUNT(activity_sessions.id) AS count
      SQL
    end

    def from_and_join_clauses
      <<-SQL
        FROM lms.activity_sessions
      SQL
    end

    def where_clause
      <<-SQL
        WHERE
          activity_sessions.state = 'finished'
      SQL
    end
  end
end
