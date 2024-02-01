# frozen_string_literal: true

module Snapshots
  class SentencesWrittenQuery < ActivitySessionCountQuery
    def select_clause
      "SELECT IFNULL(SUM(activities.question_count), 0) AS count"
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.activities
          ON activity_sessions.activity_id = activities.id
      SQL
    end
  end
end
