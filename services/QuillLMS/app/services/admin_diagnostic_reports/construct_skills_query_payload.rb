# frozen_string_literal: true

module AdminDiagnosticReports
  class ConstructSkillsQueryPayload < ConstructQueryPayload
    private def report_specific_filters
      {
        aggregation: specific_filters&.aggregation || DEFAULT_AGGREGATION,
        diagnostic_id: specific_filters&.diagnostic_id || DEFAULT_DIAGNOSTIC_ID
      }
    end
  end
end
