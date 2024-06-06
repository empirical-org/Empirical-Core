# frozen_string_literal: true

module AdminDiagnosticReports
  class ConstructOverviewQueryPayload < ConstructQueryPayload
    private def report_specific_filters
      {
        aggregation: specific_filters&.aggregation || DEFAULT_AGGREGATION
      }
    end
  end
end
