# frozen_string_literal: true

class ProgressReports::ActivitySession
  def initialize(teacher)
    @teacher = teacher
  end

  def results(filters)
    filters = (filters || {}).with_indifferent_access
    query = ::ActivitySession.includes(:user, :classroom_unit, activity: [:standard, :classification])
      .references(:classification)
      .completed
      .by_teacher(@teacher)
      .order(ActivitySession.search_sort_sql(filters[:sort]))

    ActivitySession.with_filters(query, filters)
  end
end
