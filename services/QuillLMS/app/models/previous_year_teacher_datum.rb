class PreviousYearTeacherDatum < ApplicationRecord
  belongs_to :user
  validates :year, presence: true

  before_save :calculate_data

  def calculate_data
    school_year_start = Date.new(year, 1, 1) + 7.months
    school_year_end = school_year_start + 1.year
    raise "Cannot calculate data for a school year that is still ongoing." if school_year_end > Time.now
    self.data = {
      total_students: total_students(school_year_start, school_year_end),
      active_students: active_students_query(user).where("activity_sessions.completed_at >= ? and activity_sessions.completed_at < ?", school_year_start, school_year_end).count
      # activities_assigned: activities_assigned_this_year,
      # completed_activities: activities_finished_this_year,
      # completed_activities_per_student: activities_per_student(active_students_this_year, activities_finished_this_year),
      # percent_completed_activities: activities_assigned_this_year > 0 ? (activities_finished_this_year.to_f / activities_assigned_this_year).round(2) : 'N/A',
      # diagnostics_assigned: diagnostics_assigned_this_year,
      # diagnostics_finished: diagnostics_finished_this_year,
      # percent_completed_diagnostics: diagnostics_assigned_this_year > 0 ? (diagnostics_finished_this_year.to_f / diagnostics_assigned_this_year).round(2) : 'N/A'
    }
  end

  private def total_students(school_year_start, school_year_end)
    all_classrooms = user.classrooms_i_teach + user.archived_classrooms
    year_classrooms = all_classrooms.select { |c| school_year_start <= c.created_at && school_year_end > c.created_at }
    year_classrooms.sum { |c| c.students.count}
  end

  private def active_students_query(user)
    @active_students ||= ActivitySession.unscoped.select(:user_id).distinct.joins("inner join classroom_units on classroom_unit.id = activity_sessions.classroom_unit_id").joins("inner join classrooms_teachers on classrooms_teachers.classroom_id = classroom_units.classroom_id").where(state: 'finished').where('classrooms_teachers.user_id = ?', user.id)
  end
end
