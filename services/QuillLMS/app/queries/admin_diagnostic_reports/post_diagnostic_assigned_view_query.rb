# frozen_string_literal: true

module AdminDiagnosticReports
  class PostDiagnosticAssignedViewQuery < DiagnosticAggregateViewQuery
    def specific_select_clause = "COUNT(DISTINCT CONCAT(performance.classroom_unit_id, ':', performance.student_id)) AS post_students_assigned"

    def relevant_date_column = "performance.post_assigned_at"

    private def rollup_aggregation_hash
      {
        post_students_assigned: sum_aggregate
      }
    end
  end
end
