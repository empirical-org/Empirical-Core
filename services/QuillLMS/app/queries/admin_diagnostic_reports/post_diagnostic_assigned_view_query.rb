# frozen_string_literal: true

module AdminDiagnosticReports
  class PostDiagnosticAssignedViewQuery < DiagnosticAggregateViewQuery
    def specific_select_clause
      <<-SQL
        COUNT(post_assigned_at) AS post_students_assigned
      SQL
    end

    def relevant_date_column
      "performance.post_assigned_at"
    end

    private def rollup_aggregation_hash
      {
        post_students_assigned: sum_aggregate
      }
    end
  end
end
