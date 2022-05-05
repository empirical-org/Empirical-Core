# frozen_string_literal: true

class PreviousYearSchoolDatum
  include VitallySchoolStats

  def initialize(school, year)
    @year = year
    @school = school
  end

  def calculate_data
    school_year_start = Date.new(@year, 7, 1)
    school_year_end = school_year_start + 1.year
    raise "Cannot calculate data for a school year that is still ongoing." if school_year_end > Time.current

    active_students_this_year = active_students_query(@school).where("activity_sessions.updated_at >= ? and activity_sessions.updated_at < ?", school_year_start, school_year_end).count
    activities_finished_this_year = activities_finished_query(@school).where("activity_sessions.updated_at >= ? and activity_sessions.updated_at < ?", school_year_start, school_year_end).count
    {
      # this will not be accurate if calculated after the last day of the school year
      total_students: @school.students.where(last_sign_in: school_year_start..school_year_end).count,
      active_students: active_students_this_year,
      activities_finished: activities_finished_this_year,
      activities_per_student: activities_per_student(active_students_this_year, activities_finished_this_year)
    }
  end
end
