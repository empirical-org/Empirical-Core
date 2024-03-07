# frozen_string_literal: true

module Snapshots
  class ReportingSessionCountQuery < ReportingSessionQuery
    def run
      {
        count: run_query.first[:count]
      }
    end
  end
end
