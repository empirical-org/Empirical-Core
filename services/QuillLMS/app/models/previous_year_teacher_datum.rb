# == Schema Information
#
# Table name: previous_year_teacher_data
#
#  id         :bigint           not null, primary key
#  data       :jsonb
#  year       :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_previous_year_teacher_data_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class PreviousYearTeacherDatum < ApplicationRecord
  include VitallyTeacherStatsHelper

  DIAGNOSTIC_ID = 4

  belongs_to :user
  validates :year, presence: true

  before_save :calculate_data

  def calculate_data
    school_year_start = Date.new(year, 1, 1) + 7.months
    school_year_end = school_year_start + 1.year
    raise "Cannot calculate data for a school year that is still ongoing." if school_year_end > Time.now

    active_students = active_students_query(user).where("activity_sessions.completed_at >= ? and activity_sessions.completed_at < ?", school_year_start, school_year_end).count
    activities_assigned = activities_assigned_in_year_count(user, school_year_start, school_year_end)
    activities_finished = activities_finished_query(user).where("activity_sessions.completed_at >= ? and activity_sessions.completed_at < ?", school_year_start, school_year_end).count
    diagnostics_assigned_this_year = diagnostics_assigned_in_year_count(user, school_year_start, school_year_end)
    diagnostics_finished_this_year = diagnostics_finished(user).where("activity_sessions.completed_at >=? and activity_sessions.completed_at < ?", school_year_start, school_year_end).count
    self.data = {
      total_students: total_students_in_year(user, school_year_start, school_year_end),
      active_students: active_students,
      activities_assigned: activities_assigned,
      completed_activities: activities_finished,
      completed_activities_per_student: activities_per_student(active_students, activities_finished),
      percent_completed_activities: activities_assigned > 0 ? (activities_finished.to_f / activities_assigned).round(2) : 'N/A',
      diagnostics_assigned: diagnostics_assigned_this_year,
      diagnostics_finished: diagnostics_finished_this_year,
      percent_completed_diagnostics: diagnostics_assigned_this_year > 0 ? (diagnostics_finished_this_year.to_f / diagnostics_assigned_this_year).round(2) : 'N/A'
    }
  end
end
