# frozen_string_literal: true

module AdminDiagnosticReports
  class PreDiagnosticAssignedViewQuery < DiagnosticAggregateViewQuery
    def specific_select_clause = "COUNT(DISTINCT CONCAT(performance.pre_classroom_unit_id, ':', performance.student_id)) AS pre_students_assigned"

    def relevant_date_column = "performance.pre_assigned_at"

    private def rollup_aggregation_hash
      {
        pre_students_assigned: sum_aggregate
      }
    end
  end
end
