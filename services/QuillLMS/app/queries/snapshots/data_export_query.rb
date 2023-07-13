# frozen_string_literal: true

module Snapshots
  class DataExportQuery < PeriodQuery
    def query
      <<-SQL
        SELECT
          activity_sessions.id AS activity_session_id,
          activity_classifications.name AS activity_classification_name,
          classrooms_teachers.classroom_id AS classroom_id,
          EXTRACT(EPOCH FROM (activity_sessions.completed_at + INTERVAL '#{current_user.utc_offset} seconds')) AS completed_at,
          activity_sessions.completed_at + INTERVAL '#{current_user.utc_offset} seconds' AS visual_date,
          activity_sessions.timespent AS timespent,
          (CASE WHEN activity_classifications.scored THEN activity_sessions.percentage ELSE -1 END) AS percentage,
          standards.name AS standard,
          activity_sessions.user_id AS student_id,
          activities.name AS activity_name,
          users.name AS student_name,
          substring(users.name from (position(' ' in users.name) + 1) for (char_length(users.name))) || substring(users.name from (1) for (position(' ' in users.name))) AS sorting_name
            FROM (#{super})
      SQL
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.classroom_units
          ON classrooms.id = classroom_units.classroom_id
        JOIN lms.activity_sessions
          ON classroom_units.id = activity_sessions.classroom_unit_id
        JOIN lms.activities
          ON activity_sessions.activity_id = activities.id
        JOIN lms.activity_classifications
          ON activities.activity_classification_id = activity_classification.id
        JOIN lms.standards
          ON activities.standard_id = standards.id
        JOIN lms.users
          ON schools_users.user_id = users.id
        JOIN lms.units
          ON classroom_units.unit_id = unit.id
      SQL
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end
  end
end
