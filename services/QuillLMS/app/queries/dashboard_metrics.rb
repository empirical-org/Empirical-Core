# frozen_string_literal: true

module DashboardMetrics

  def today
    @today ||= Date.current
  end

  def days_since_last_sunday
    @days_since_last_sunday ||= today.wday == 0 ? 0 : ((today.wday + 6) % 7) + 1
  end

  def last_sunday
    @last_sunday ||= today - days_since_last_sunday
  end

  def july_first_of_this_year
    @july_first_of_this_year ||= Date.parse("01-07-#{today.year}")
  end

  def last_july_first
    @last_july_first ||= today.month > 7 ? july_first_of_this_year : july_first_of_this_year - 1.year
  end

end
