# frozen_string_literal: true

module Snapshots
  class SentencesWrittenQuery < CountQuery
    def run_query
      QuillBigQuery::Runner.execute(utilizing_subquery)
    end

    def utilizing_subquery
      <<-SQL
        SELECT COUNT(*) AS count
          FROM (#{query})
      SQL
    end

    def select_clause
      "SELECT COUNT(admins.id)"
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN special.concept_results
          ON activity_sessions.id = concept_results.activity_session_id
      SQL
    end

    def group_by_clause
      super + ", activity_sessions.id, concept_results.question_number"
    end
  end
end
