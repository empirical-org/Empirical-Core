# frozen_string_literal: true

module Snapshots
  class AverageActivitiesCompletedPerStudentQuery < PeriodQuery
    attr_reader :params

    def initialize(*params)
      # We pull params here because we're going to do a naive pass-through to sibling queries below
      @params = params

      super
    end

    # Adding a no-op overwrite of query to avoid confusion in debugging where this class
    # might assemble a query even though it never intends to run one because it pulls data
    # from other queries instead
    def query
      ''
    end

    def run
      # This query, and both of the queries below, inherit their `initialize` method from
      # PeriodQuery.  This means that they should all have identical method signatures.
      activities_completed = ActivitiesCompletedQuery.run(*params)[:count]
      active_students = ActiveStudentsQuery.run(*params)[:count]
      # max prevents us from dividing by 0 if there are no active students
      {
        'count': activities_completed / [active_students, 1].max.to_f
      }
    end
  end
end
