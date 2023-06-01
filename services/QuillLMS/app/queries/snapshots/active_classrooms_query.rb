# frozen_string_literal: true

module Snapshots
  class ActiveClassroomsQuery < CountQuery
    def select_clause
      "SELECT COUNT(DISTINCT classrooms.id) AS count"
    end
  end
end
