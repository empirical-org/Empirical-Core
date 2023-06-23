# frozen_string_literal: true

module Snapshots
  class TopConceptsPracticedQuery < TopXQuery
    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN lms.activities
          ON activity_sessions.activity_id = activities.id
        JOIN lms.activity_category_activities
          ON activities.id = activity_category_activities.activity_id
        JOIN lms.activity_categories
          ON activity_category_activities.activity_category_id = activity_categories.id
      SQL
    end

    def relevant_count_column
      "activity_sessions.id"
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end

    def relevant_group_column
      "activity_categories.name"
    end
  end
end
