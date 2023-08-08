# frozen_string_literal: true

module Snapshots
  class DataExportQuery < PeriodQuery

    def run
      run_query
    end

    def select_clause
      <<-SQL
        SELECT
          activity_sessions.id AS activity_session_id,
          activity_classifications.name AS tool,
          classrooms_teachers.classroom_id AS classroom_id,
          activity_sessions.completed_at AS completed_at,
          activity_sessions.timespent AS timespent,
          (CASE WHEN activity_classifications.scored THEN activity_sessions.percentage ELSE -1 END) AS score,
          standards.name AS standard,
          activity_sessions.user_id AS student_id,
          activities.name AS activity_name,
          units.name AS activity_pack,
          users.name AS teacher_name,
          students.name AS student_name,
          students.email AS student_email,
          schools.name AS school_name,
          classrooms.name AS classroom_name,
          classrooms.grade AS classroom_grade
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
          ON activities.activity_classification_id = activity_classifications.id
        JOIN lms.standards
          ON activities.standard_id = standards.id
        JOIN lms.users
          ON schools_users.user_id = users.id
        JOIN lms.units
          ON classroom_units.unit_id = units.id
        JOIN lms.users AS students
          ON activity_sessions.user_id = students.id
      SQL
    end

    def relevant_date_column
      "activity_sessions.completed_at"
    end

    def limit_clause
      "LIMIT 10"
    end
  end
end
