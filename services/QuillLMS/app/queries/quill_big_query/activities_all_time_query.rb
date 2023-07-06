# frozen_string_literal: true

module QuillBigQuery
  class ActivitiesAllTimeQuery < ::QuillBigQuery::Query

    def run
      run_query
    end

    def select_clause
      <<-SQL
        SELECT activity_sessions.id
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
