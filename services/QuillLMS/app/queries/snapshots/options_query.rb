# frozen_string_literal: true

module Snapshots
  class OptionsQuery < ::QuillBigQuery::Query
    attr_accessor :admin_id

    def initialize(admin_id, options = {})
      @admin_id = admin_id
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
      "WHERE admins.id = #{admin_id}"
    end
  end
end
