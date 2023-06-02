# frozen_string_literal: true

module Snapshots
  class OptionsQuery < ::ApplicationService
    attr_accessor :admin_id

    def initialize(admin_id)
      @admin_id = admin_id
    end

    def run
      QuillBigQuery::Runner.execute(query)
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
          JOIN lms.schools_admins
            ON schools_users.school_id = schools_admins.school_id
          JOIN lms.users AS admins
            ON schools_admins.user_id = admins.id
      SQL
    end

    def where_clause
      "WHERE admins.id = #{admin_id}"
    end

    def group_by_clause
      ""
    end

    def order_by_clause
      ""
    end

    def limit_clause
      ""
    end
  end
end
