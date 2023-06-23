# frozen_string_literal: true

module Snapshots
  class OptionsQuery < ::QuillBigQuery::Query
    attr_accessor :admin_id, :school_ids, :grades, :teacher_ids

    def initialize(admin_id:, school_ids: nil, grades: nil, teacher_ids: nil, options: {})
      @admin_id = admin_id
      @school_ids = school_ids
      @grades = grades
      @teacher_ids = teacher_ids
      super(options)
    end

    def run
      run_query
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
          JOIN lms.schools_admins
            ON schools_users.school_id = schools_admins.school_id
          JOIN lms.users AS admins
            ON schools_admins.user_id = admins.id
      SQL
    end

    def where_clause
      <<-SQL
        WHERE admins.id = #{admin_id}
        #{school_ids_where_clause}
        #{grades_where_clause}
        #{teacher_ids_where_clause}
      SQL
    end

    def order_by_clause
      "ORDER BY #{order_by_column}"
    end

    private def order_by_column
      raise NotImplementedError
    end

    private def school_ids_where_clause
      return "" if school_ids.nil? || school_ids.empty?

      "AND schools_users.school_id IN (#{school_ids.join(',')})"
    end

    private def grades_where_clause
      return "" if grades.nil? || grades.empty?

      "AND classrooms.grade IN (#{grades.map { |g| "'#{g}'" }.join(',')})"
    end

    private def teacher_ids_where_clause
      return "" if teacher_ids.nil? || teacher_ids.empty?

      "AND classrooms_teachers.user_id IN (#{teacher_ids.join(',')})"
    end
  end
end
