# == Schema Information
#
# Table name: previous_year_school_data
#
#  id         :bigint           not null, primary key
#  data       :jsonb
#  year       :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  school_id  :bigint           not null
#
# Indexes
#
#  index_previous_year_school_data_on_school_id  (school_id)
#
# Foreign Keys
#
#  fk_rails_...  (school_id => schools.id)
#
class PreviousYearSchoolDatum < ApplicationRecord
  include VitallySchoolStatsHelper

  belongs_to :school
  validates :year, presence: true

  def calculate_data
    school_year_start = Date.new(year, 1, 1) + 7.months
    school_year_end = school_year_start + 1.year
    raise "Cannot calculate data for a school year that is still ongoing." if school_year_end > Time.now

    active_students_this_year = active_students_query(@school).where("activity_sessions.updated_at >= ? and activity_sessions.updated_at < ?", school_year_start, school_year_end).count
    activities_finished_this_year = activities_finished_query(@school).where("activity_sessions.updated_at >= ? and activity_sessions.updated_at < ?", school_year_start, school_year_end).count
    self.data = {
      # this will not be accurate if calculated after the last day of the school year
      total_students: school.students.where(last_sign_in: school_year_start..school_year_end).count,
      active_students: active_students_this_year,
      activities_finished: activities_finished_this_year,
      activities_per_student: activities_per_student(active_students_this_year, activities_finished_this_year)
    }
  end
end
