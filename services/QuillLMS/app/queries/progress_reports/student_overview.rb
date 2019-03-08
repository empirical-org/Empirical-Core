class ProgressReports::StudentOverview
  def self.results(classroom_id, student_id)
    ActiveRecord::Base.connection.execute(
      "SELECT EXTRACT(EPOCH FROM activity_sessions.completed_at) AS completed_at, activity_sessions.id AS activity_sessions_id, activities.name, activity_sessions.percentage, units.name AS unit_name, activities.activity_classification_id, cuas.completed AS is_a_completed_lesson, activities.id AS activity_id, classroom_units.id AS classroom_unit_id
      FROM classroom_units
       LEFT JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id AND activity_sessions.user_id = #{ActiveRecord::Base.sanitize(student_id)} AND activity_sessions.visible = true AND activity_sessions.is_final_score = true
       JOIN units ON units.id = classroom_units.unit_id
       JOIN activities ON activities.id = activity_sessions.activity_id
       LEFT JOIN unit_activities ON unit_activities.activity_id = activities.id AND unit_activities.unit_id = units.id
       LEFT JOIN classroom_unit_activity_states AS cuas ON cuas.unit_activity_id = unit_activities.id AND cuas.classroom_unit_id = classroom_units.id
       WHERE classroom_units.classroom_id = #{ActiveRecord::Base.sanitize(classroom_id)} AND #{ActiveRecord::Base.sanitize(student_id)} = ANY (classroom_units.assigned_student_ids::int[])
       AND classroom_units.visible = true AND units.visible = true
       GROUP BY units.name, activity_sessions.completed_at, activities.name, activity_sessions.percentage, cuas.completed, activity_sessions.id, activities.activity_classification_id, activities.id, units.id, classroom_units.id
       ORDER BY activity_sessions.completed_at").to_a
  end
end
