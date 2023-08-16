# frozen_string_literal: true

module ImpactMetrics
  class SchoolsContainingCertainTeachersQuery < ::QuillBigQuery::Query
    attr_reader :teacher_ids

    def initialize(teacher_ids:, **options)
      @teacher_ids = teacher_ids

      super(**options)
    end

    def run
      runner.execute(query)
    end

    def select_clause
      <<-SQL
        SELECT DISTINCT schools.id, schools.free_lunches
      SQL
    end

    def from_and_join_clauses
      <<-SQL
        FROM lms.schools
        JOIN lms.schools_users ON schools.id = schools_users.school_id
      SQL
    end

    def where_clause
      <<-SQL
        WHERE schools_users.user_id IN (#{teacher_ids.join(', ')})
      SQL
    end
  end
end
