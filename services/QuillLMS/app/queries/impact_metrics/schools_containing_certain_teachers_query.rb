# frozen_string_literal: true

module ImpactMetrics
  class SchoolsContainingCertainTeachersQuery < ::QuillBigQuery::Query

    def initialize(teacher_ids:, options: {})
      @teacher_ids = teacher_ids

      super(options)
    end

    def run
      runner.execute(query, {teacher_ids: @teacher_ids})
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
        WHERE schools_users.user_id IN UNNEST(@teacher_ids)
      SQL
    end
  end
end
