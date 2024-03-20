# frozen_string_literal: true

module DashboardMetrics
  extend ActiveSupport::Concern

  def today
    @today ||= Date.current
  end

  def days_since_last_sunday
    @days_since_last_sunday ||= today.wday % 7
  end

  def last_sunday
    @last_sunday ||= today - days_since_last_sunday
  end

  def school_year_start
    @school_year_start ||= School.school_year_start(today)
  end

end
