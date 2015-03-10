class Unit < ActiveRecord::Base

  belongs_to :classroom
  has_many :classroom_activities, dependent: :destroy
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities

  def self.for_standards_progress_report(teacher, filters)
    with(filtered_activity_sessions: ActivitySession.proficient_sessions_for_progress_report(teacher, filters))
      .select("units.id as id, units.name as name")
      .joins('JOIN classroom_activities ON classroom_activities.unit_id = units.id')
      .joins('JOIN filtered_activity_sessions ON filtered_activity_sessions.classroom_activity_id = classroom_activities.id')
      .group('units.id')
      .order("units.created_at asc, units.name asc") # Try order by creation date, fall back to name)
  end
end
