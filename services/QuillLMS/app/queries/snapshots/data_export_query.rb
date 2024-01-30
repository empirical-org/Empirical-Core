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
          MAX(activity_classifications.name) AS tool,
          MAX(classrooms_teachers.classroom_id) AS classroom_id,
          MAX(activity_sessions.completed_at) AS completed_at,
          MAX(activity_sessions.timespent) AS timespent,
          MAX(CASE WHEN activity_classifications.scored THEN activity_sessions.percentage ELSE -1 END) AS score,
          MAX(standards.name) AS standard,
          MAX(activity_sessions.user_id) AS student_id,
          MAX(activities.name) AS activity_name,
          MAX(units.name) AS activity_pack,
          MAX(users.name) AS teacher_name,
          MAX(students.name) AS student_name,
          MAX(students.email) AS student_email,
          MAX(schools.name) AS school_name,
          MAX(classrooms.name) AS classroom_name,
          MAX(classrooms.grade) AS classroom_grade
      SQL
    end

    def post_query_transform(query_result)
      return query_result unless user&.time_zone

      query_result.map do |row|
        datetime_string_with_timezone = row[:completed_at].in_time_zone(user.time_zone)
        row.merge(completed_at: datetime_string_with_timezone)
      end

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
        LEFT OUTER JOIN lms.standards
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

    def order_by_clause
      "ORDER BY completed_at DESC"
    end

    def limit_clause
      "LIMIT 10"
    end

    def group_by_clause
      "GROUP BY activity_sessions.id"
    end
  end
end
