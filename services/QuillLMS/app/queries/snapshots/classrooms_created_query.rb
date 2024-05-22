# frozen_string_literal: true

module Snapshots
  class ClassroomsCreatedQuery < CountQuery
    def select_clause
      "SELECT COUNT(DISTINCT classrooms.id) AS count"
    end

    def relevant_date_column
      "classrooms.created_at"
    end
  end
end
