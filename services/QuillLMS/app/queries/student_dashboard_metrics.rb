# frozen_string_literal: true

class StudentDashboardMetrics
  include DashboardMetrics

  attr_reader :classroom_id, :user

  def initialize(user, classroom_id)
    @user = user
    @classroom_id = classroom_id
  end

  def run
    {
       day: metrics_from_start_date(today),
       week: metrics_from_start_date(last_sunday),
       month: metrics_from_start_date(today.beginning_of_month),
       year: metrics_from_start_date(school_year_start)
     }
  end

  def metrics_from_start_date(start_date)
    completed_sessions_for_timeframe = completed_sessions.where("completed_at >= ?", start_date)
    {
      activities_completed: completed_sessions_for_timeframe.count,
      timespent: completed_sessions_for_timeframe.pluck(:timespent).compact.sum
    }
  end

  def completed_sessions
    @completed_sessions ||= begin
      ActivitySession
        .unscoped
        .joins(:classroom_unit)
        .where(user:, classroom_unit: {classroom_id:})
        .where.not(completed_at: nil)
    end
  end

end
