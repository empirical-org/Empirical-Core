# frozen_string_literal: true

module Snapshots
  class SentencesWrittenQuery < ActivitySessionCountQuery
    def query
      <<-SQL
        SELECT COUNT(*) AS count
          FROM (#{super})
      SQL
    end

    def select_clause
      "SELECT COUNT(*)"
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN special.concept_results
          ON activity_sessions.id = concept_results.activity_session_id
      SQL
    end

    def group_by_clause
      "GROUP BY activity_sessions.id, concept_results.question_number"
    end
  end
end
