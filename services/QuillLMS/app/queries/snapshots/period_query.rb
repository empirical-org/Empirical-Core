# frozen_string_literal: true

module Snapshots
  class PeriodQuery < ::QuillBigQuery::Query
    attr_accessor :timeframe_start, :timeframe_end, :school_ids, :grades, :teacher_ids, :classroom_ids

    def initialize(timeframe_start:, timeframe_end:, school_ids:, grades: nil, teacher_ids: nil, classroom_ids: nil, options: {})
      @timeframe_start = timeframe_start
      @timeframe_end = timeframe_end
      @school_ids = school_ids
      @grades = grades
      @teacher_ids = teacher_ids
      @classroom_ids = classroom_ids

      super(options)
    end

    def from_and_join_clauses
      <<-SQL
        FROM lms.classrooms
          JOIN lms.classrooms_teachers
            ON classrooms.id = classrooms_teachers.classroom_id
          JOIN lms.schools_users
            ON classrooms_teachers.user_id = schools_users.user_id
          JOIN lms.schools
            ON schools_users.school_id = schools.id
      SQL
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
      "#{relevant_date_column} BETWEEN '#{timeframe_start.to_date.to_s(:db)}' AND '#{timeframe_end.to_date.to_s(:db)}'"
    end

    def school_ids_where_clause
      "AND schools.id IN (#{school_ids.join(',')})"
    end

    def grades_where_clause
      return "" if grades.blank?

      <<-SQL
        AND (
          classrooms.grade IN (#{grades.map { |g| "'#{g}'" }.join(',')})
          #{"OR classrooms.grade IS NULL" if grades.include?("null")}
        )
      SQL
    end

    def teacher_ids_where_clause
      return "" if teacher_ids.blank?

      "AND schools_users.user_id IN (#{teacher_ids.join(',')})"
    end

    def classroom_ids_where_clause
      return "" if classroom_ids.blank?

      "AND classrooms.id IN (#{classroom_ids.join(',')})"
    end
  end
end
