# frozen_string_literal: true

module Snapshots
  class PeriodQuery < ::QuillBigQuery::Query
    attr_accessor :timeframe_start, :timeframe_end, :school_ids, :grades

    def initialize(timeframe_start, timeframe_end, school_ids, grades = nil, options = {})
      @timeframe_start = timeframe_start
      @timeframe_end = timeframe_end
      @school_ids = school_ids
      @grades = grades

      super(options)
    end

    def query
      <<-SQL
        #{select_clause}
          #{from_and_join_clauses}
          #{where_clause}
          #{group_by_clause}
          #{order_by_clause}
          #{limit_clause}
      SQL
    end

    def select_clause
      raise NotImplementedError
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
          #{grade_where_clause}
      SQL
    end

    def timeframe_where_clause
      "#{relevant_date_column} BETWEEN '#{timeframe_start}' AND '#{timeframe_end}'"
    end

    def school_ids_where_clause
      "AND schools.id IN (#{school_ids.join(',')})"
    end

    def grade_where_clause
      return "" unless grades

      "AND classrooms.grade IN (#{grades.map { |g| "'#{g}'" }.join(',')})"
    end
  end
end
