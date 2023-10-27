# frozen_string_literal: true

module Snapshots
  class UntruncatedDataExportQuery < DataExportQuery
    def limit_clause
      "LIMIT 10" # TODO: remove before live traffic
    end
  end
end
