# frozen_string_literal: true

module AdminDiagnosticReports
  class PreDiagnosticAssignedQuery < DiagnosticAggregateQuery
    def specific_select_clause
      <<-SQL
          COUNT(DISTINCT CONCAT(classroom_units.id, ':', assigned_student_id)) AS pre_students_assigned
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        CROSS JOIN UNNEST(classroom_units.assigned_student_ids) AS assigned_student_id
        JOIN lms.unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id
        JOIN lms.activities
          ON unit_activities.activity_id = activities.id
      SQL
    end

    def relevant_date_column
      "classroom_units.created_at"
    end

    private def rollup_aggregation_hash
      {
        pre_students_assigned: sum_aggregate
      }
    end
  end
end
