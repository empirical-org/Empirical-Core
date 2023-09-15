# frozen_string_literal: true

module AdminDiagnosticReports
  class PostDiagnosticAggregateCompletedQuery < DiagnosticAggregateQuery
    def specific_select_clause
      <<-SQL
          COUNT(DISTINCT activity_sessions.id) AS pre_students_assigned
          AVG(activity_sessions.percentage) AS post_average_percentage
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN lms.activities AS post_activities
          ON activity_sessions.activity_id = post_activities.id
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
      "activity_sessions.completed_at"
    end
  end
end
