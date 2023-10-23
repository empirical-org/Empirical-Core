# frozen_string_literal: true

module AdminDiagnosticReports
  class PostDiagnosticAssignedQuery < DiagnosticAggregateQuery
    def specific_select_clause
      <<-SQL
          COUNT(DISTINCT CONCAT(classroom_units.id, ':', assigned_student_id)) AS post_students_assigned
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        CROSS JOIN UNNEST(classroom_units.assigned_student_ids) AS assigned_student_id
        JOIN lms.unit_activities
          ON classroom_units.unit_id = unit_activities.unit_id
        JOIN lms.activities AS post_activities
          ON unit_activities.activity_id = post_activities.id
        JOIN lms.activities
          ON post_activities.id = activities.follow_up_activity_id
      SQL
    end

    def where_clause
      super + <<-SQL
          #{activity_classification_where_clause}
      SQL
    end

    def activity_classification_where_clause
      "AND activities.activity_classification_id = #{DIAGNOSTIC_CLASSIFICATION_ID}"
    end

    def relevant_date_column
      "classroom_units.created_at"
    end

    private def aggregate_diagnostic(rows)
      {
        post_students_assigned: roll_up_sum(rows, :post_students_assigned)
      }
    end
  end
end
