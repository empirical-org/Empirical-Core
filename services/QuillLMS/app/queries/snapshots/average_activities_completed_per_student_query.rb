# frozen_string_literal: true

module Snapshots
  class AverageActivitiesCompletedPerStudentQuery < AverageQuery
    def numerator_query
      ActivitiesCompletedQuery
    end

    def denominator_query
      ActiveStudentsQuery
    end
  end
end
