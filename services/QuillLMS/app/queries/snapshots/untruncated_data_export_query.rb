# frozen_string_literal: true

module Snapshots
  class UntruncatedDataExportQuery < DataExportQuery
    def limit_clause
      ""
    end
  end
end
