# frozen_string_literal: true

module Snapshots
  class ReportingSessionTopXQuery < ReportingSessionQuery
    NUMBER_OF_RECORDS = 10

    def run
      run_query
    end

    def order_by_clause
      "ORDER BY count DESC"
    end

    def limit_clause
      "LIMIT #{NUMBER_OF_RECORDS}"
    end
  end
end
