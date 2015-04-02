class Unit < ActiveRecord::Base

  belongs_to :classroom
  has_many :classroom_activities, dependent: :destroy
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities

  def self.for_standards_progress_report(teacher, filters)
    with(best_activity_sessions: ActivitySession.for_standards_report(teacher, filters))
      .select("units.id as id, units.name as name")
      .joins('JOIN classroom_activities ON classroom_activities.unit_id = units.id')
      .joins('JOIN best_activity_sessions ON best_activity_sessions.classroom_activity_id = classroom_activities.id')
      .group('units.id')
      .order("units.created_at asc, units.name asc") # Try order by creation date, fall back to name)
  end
end
