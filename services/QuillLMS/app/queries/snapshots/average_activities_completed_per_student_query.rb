# frozen_string_literal: true

module Snapshots
  class AverageActivitiesCompletedPerStudentQuery < PeriodQuery
    def initialize(*params)
      @params = params

      super
    end

    def run
      activities_completed = ActivitiesCompletedQuery.run(*@params)[:count]
      active_students = ActiveStudentsQuery.run(*@params)[:count]
      # max prevents us from dividing by 0 if there are no active students
      {
        'count': activities_completed / [active_students, 1].max.to_f
      }
    end
  end
end
