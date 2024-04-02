# frozen_string_literal: true

module Snapshots
  class AverageActiveClassroomsPerTeacherQuery < AverageQuery
    def numerator_query
      ActiveClassroomsQuery
    end

    def denominator_query
      ActiveTeachersQuery
    end
  end
end
