class ProgressReports::Standards::Unit
  def initialize(teacher)
    @teacher = teacher
  end

  def results(filters)
    best_activity_sessions_query = ProgressReports::Standards::ActivitySession.new(@teacher).results(filters).to_sql
    best_activity_sessions = "( #{best_activity_sessions_query} ) AS best_activity_sessions"

    ::Unit
      .select("units.id AS id, units.name AS name")
      .joins('JOIN classroom_units ON classroom_units.unit_id = units.id')
      .joins("JOIN #{best_activity_sessions} ON best_activity_sessions.classroom_unit_id = classroom_units.id")
      .group('units.id')
      .order('units.created_at ASC, units.name ASC')
  end
end
