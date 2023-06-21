# frozen_string_literal: true

module Snapshots
  class ClassroomsOptionsQuery < OptionsQuery
    def select_clause
      "SELECT DISTINCT classrooms.id, classrooms.name"
    end

    private def order_by_column
      "classrooms.name"
    end
  end
end
