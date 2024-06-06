# frozen_string_literal: true

module AdminDiagnosticReports
  class ConstructStudentsQueryPayload < ConstructQueryPayload
    private def report_specific_filters
      {
        diagnostic_id: specific_filters&.diagnostic_id || DEFAULT_DIAGNOSTIC_ID,
        limited: false
      }
    end
  end
end
