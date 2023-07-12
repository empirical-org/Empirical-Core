# frozen_string_literal: true

module Snapshots
  class AverageActiveStudentsPerClassroomQuery < AverageQuery
    def numerator_query
      ActiveStudentsQuery
    end

    def denominator_query
      ActiveClassroomsQuery
    end
  end
end
