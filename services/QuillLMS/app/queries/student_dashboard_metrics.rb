# frozen_string_literal: true

class StudentDashboardMetrics
  include DashboardMetrics

  def initialize(user, classroom)
    @user = user
    @classroom = classroom
  end

  def run
    {
       day: metrics_from_start_date(today),
       week: metrics_from_start_date(last_sunday),
       month: metrics_from_start_date(today.beginning_of_month),
       year: metrics_from_start_date(last_july_first)
     }
  end

  def metrics_from_start_date(start_date)
    completed_sessions_for_timeframe = completed_sessions.where("completed_at >= ?", start_date)
    {
      activities_completed: completed_sessions_for_timeframe.count,
      timespent: completed_sessions_for_timeframe.pluck(:timespent).sum
    }
  end

  def completed_sessions
    @completed_sessions ||= begin
      classroom_unit_ids = ClassroomUnit.where(classroom_id: @classroom.id).pluck(:id)

      ActivitySession
        .where(classroom_unit_id: classroom_unit_ids, user_id: @user.id)
        .where.not(completed_at: nil)
    end
  end

end
