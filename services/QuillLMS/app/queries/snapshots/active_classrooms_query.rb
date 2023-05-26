# frozen_string_literal: true

module Snapshots
  class ActiveClassroomsQuery < CountQuery
    def select_clause
      "SELECT COUNT(DISTINCT classrooms.id) AS count"
    end

    def query
      <<-SQL
        SELECT
          COUNT(DISTINCT classrooms.id) AS classrooms_count,
          COUNT(DISTINCT classrooms_teachers.id) AS classrooms_teachers_count,
        FROM lms.classrooms
        JOIN lms.classrooms_teachers
          ON classrooms.id = classrooms_teachers.classroom_id
      SQL
    end
  end
end
