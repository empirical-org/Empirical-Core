# frozen_string_literal: true

module AdminDiagnosticReports
  class PreDiagnosticAggregateAssignedQuery < DiagnosticAggregateQuery
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

    def where_clause
      super + <<-SQL
          #{activity_classification_where_clause}
          #{pre_diagnostics_where_clause}
      SQL
    end

    def activity_classification_where_clause
      "AND activities.activity_classification_id = #{DIAGNOSTIC_CLASSIFICATION_ID}"
    end

    def pre_diagnostics_where_clause
      "AND activities.follow_up_activity_id IS NOT NULL"
    end

    def relevant_date_column
      "classroom_units.created_at"
    end
  end
end
