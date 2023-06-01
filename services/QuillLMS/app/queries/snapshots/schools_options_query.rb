# frozen_string_literal: true

module Snapshots
  class SchoolsOptionsQuery < OptionsQuery
    def select_clause
      "SELECT DISTINCT schools.id, schools.name"
    end

    def from_and_join_clauses
      super + <<-SQL
        JOIN lms.schools
          ON schools_users.school_id = schools.id
      SQL
    end
  end
end
