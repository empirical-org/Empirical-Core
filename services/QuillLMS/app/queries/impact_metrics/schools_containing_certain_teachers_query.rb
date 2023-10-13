# frozen_string_literal: true

module ImpactMetrics
  class SchoolsContainingCertainTeachersQuery < ::QuillBigQuery::Query

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
        WHERE schools_users.user_id IN (
          SELECT users.id AS id
          FROM lms.users users
          JOIN lms.units ON units.user_id = users.id
          JOIN lms.classroom_units ON classroom_units.unit_id = units.id
          JOIN lms.activity_sessions a_s ON a_s.classroom_unit_id = classroom_units.id
          GROUP BY users.id
          HAVING count(a_s) > #{ActiveTeachersAllTimeCountQuery::ACTIVITY_SESSION_MINIMUM}
        )
      SQL
    end
  end
end
