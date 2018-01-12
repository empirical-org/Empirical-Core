class ProgressReports::StudentOverview
  def self.results(classroom_id, student_id)
    ActiveRecord::Base.connection.execute(
      "SELECT EXTRACT(EPOCH FROM activity_sessions.completed_at) AS completed_at, activity_sessions.id AS activity_sessions_id, activities.name, activity_sessions.percentage, units.name AS unit_name, activities.activity_classification_id, classroom_activities.completed AS is_a_completed_lesson, activities.id AS activity_id, classroom_activities.id AS classroom_activity_id
      FROM classroom_activities
       LEFT JOIN activity_sessions ON classroom_activities.id = activity_sessions.classroom_activity_id AND activity_sessions.user_id = #{ActiveRecord::Base.sanitize(student_id)} AND activity_sessions.visible = true AND activity_sessions.is_final_score = true 
       JOIN units ON units.id = classroom_activities.unit_id
       JOIN activities ON activities.id = classroom_activities.activity_id
       WHERE classroom_activities.classroom_id = #{ActiveRecord::Base.sanitize(classroom_id)} AND #{ActiveRecord::Base.sanitize(student_id)} = ANY (classroom_activities.assigned_student_ids::int[])
       AND classroom_activities.visible = true AND units.visible = true
       GROUP BY units.name, activity_sessions.completed_at, activities.name, activity_sessions.percentage, classroom_activities.completed, activity_sessions.id, activities.activity_classification_id, activities.id, units.id, classroom_activities.id
       ORDER BY activity_sessions.completed_at").to_a
  end
end
