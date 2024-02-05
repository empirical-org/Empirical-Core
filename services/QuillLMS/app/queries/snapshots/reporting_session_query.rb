# frozen_string_literal: true

module Snapshots
  class ReportingSessionQuery < ::QuillBigQuery::Query
    attr_reader :timeframe_start, :timeframe_end, :school_ids, :grades, :teacher_ids, :classroom_ids, :user

    def initialize(timeframe_start:, timeframe_end:, school_ids:, grades: nil, teacher_ids: nil, classroom_ids: nil, user: nil, **options)
      @timeframe_start = timeframe_start
      @timeframe_end = timeframe_end
      @school_ids = school_ids
      @grades = grades
      @teacher_ids = teacher_ids
      @classroom_ids = classroom_ids
      @user = user

      super(**options)
    end

    def with_clauses
      <<-SQL
        WITH recent_reporting_sessions AS (
          SELECT
            activity_sessions.user_id as student_id,
            activity_sessions.activity_id as activity_id,
            activities.name as activity_name,
            schools.id as school_id,
            schools.name as school_name,
            classrooms_teachers.user_id as teacher_id,
            users.name as teacher_name,
            classrooms.id as classroom_id,
            classrooms.grade as grade,
            DATETIME_TRUNC(activity_sessions.completed_at, DAY) as completed_date,
            SUM(activity_sessions.timespent) as time_spent,
            SUM(activities.question_count) as question_count,
            Count(activity_sessions.id) as activity_count
          FROM lms.activity_sessions
            INNER JOIN lms.activities ON activities.id = activity_sessions.activity_id
            INNER JOIN lms.classroom_units ON classroom_units.id = activity_sessions.classroom_unit_id
            INNER JOIN lms.classrooms ON classrooms.id = classroom_units.classroom_id
            INNER JOIN lms.classrooms_teachers ON classrooms_teachers.classroom_id = classrooms.id
            INNER JOIN lms.schools_users ON schools_users.user_id = classrooms_teachers.user_id
            INNER JOIN lms.schools ON schools.id = schools_users.school_id
            INNER JOIN lms.users on users.id = classrooms_teachers.user_id
          WHERE
            classrooms_teachers.role = 'owner'
            AND activity_sessions.completed_at IS NOT NULL
            AND activity_sessions.completed_at > '2021-07-31'
          GROUP BY
            student_id,
            activity_id,
            activity_name,
            school_id,
            school_name,
            teacher_id,
            teacher_name,
            classroom_id,
            grade,
            completed_date
        )
      SQL
    end

    def from_and_join_clauses
      "FROM recent_reporting_sessions"
    end

    def relevant_date_column
      'recent_reporting_sessions.completed_date'
    end

    def where_clause
      <<-SQL
        WHERE
          #{timeframe_where_clause}
          #{school_ids_where_clause}
          #{grades_where_clause}
          #{teacher_ids_where_clause}
          #{classroom_ids_where_clause}
      SQL
    end

    def timeframe_where_clause
      "#{relevant_date_column} BETWEEN '#{timeframe_start.to_fs(:db)}' AND '#{timeframe_end.to_fs(:db)}'"
    end

    def school_ids_where_clause
      "AND recent_reporting_sessions.school_id IN (#{school_ids.join(',')})"
    end

    def grades_where_clause
      return "" if grades.blank?

      <<-SQL
        AND (
          recent_reporting_sessions.grade IN (#{grades.map { |g| "'#{g}'" }.join(',')})
          #{'OR recent_reporting_sessions.grade IS NULL' if grades.include?('null')}
        )
      SQL
    end

    def teacher_ids_where_clause
      return "" if teacher_ids.blank?

      "AND recent_reporting_sessions.teacher_id IN (#{teacher_ids.join(',')})"
    end

    def classroom_ids_where_clause
      return "" if classroom_ids.blank?

      "AND recent_reporting_sessions.classroom_id IN (#{classroom_ids.join(',')})"
    end
  end
end
