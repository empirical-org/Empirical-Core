# frozen_string_literal: true

module Snapshots
  class SentencesWrittenQuery < ReportingSessionCountQuery
    def select_clause
      "SELECT SUM(recent_reporting_sessions.question_count) AS count"
    end
  end
end
