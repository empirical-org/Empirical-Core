# frozen_string_literal: true

module AdminDiagnosticReports
  class DiagnosticAggregateViewQuery < DiagnosticAggregateQuery
    def select_clause
      <<-SQL
        SELECT
          performance.activity_id AS diagnostic_id,
          activities.name AS diagnostic_name,
          #{aggregate_by_clause} AS aggregate_id,
          #{aggregate_sort_clause} AS name,
          '#{additional_aggregation}' AS group_by,
          #{specific_select_clause}
      SQL
    end

    def rollup_select_columns
      "diagnostic_id, diagnostic_name"
    end

    def from_and_join_clauses
      <<-SQL
        FROM lms.pre_post_diagnostic_skill_group_performance_view AS performance
        JOIN lms.active_classroom_stubs_view AS classrooms ON performance.classroom_id = classrooms.id
        JOIN lms.classrooms_teachers ON classrooms.id = classrooms_teachers.classroom_id AND classrooms_teachers.role = 'owner'
        JOIN lms.schools_users ON classrooms_teachers.user_id = schools_users.user_id
        JOIN lms.activities ON performance.activity_id = activities.id
        JOIN lms.active_user_names_view AS users ON classrooms_teachers.user_id = users.id
      SQL
    end

    def school_ids_where_clause
      "AND schools_users.school_id IN (#{school_ids.join(',')})"
    end

    def where_clause
      super + <<-SQL
          #{relevant_diagnostic_where_clause}
      SQL
    end

    def relevant_diagnostic_where_clause
      "AND performance.activity_id IN (#{DIAGNOSTIC_ORDER_BY_ID.join(',')})"
    end

    def group_by_clause
      "GROUP BY performance.activity_id, activities.name, aggregate_id, #{aggregate_sort_clause}"
    end

    def materialized_views_used
      [
        "active_classroom_stubs_view",
        "active_user_names_view",
        "pre_post_diagnostic_skill_group_performance_view"
      ]
    end
  end
end
