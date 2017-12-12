class ProgressReports::StudentOverview
  def self.results(classroom_id, student_id)
    ActiveRecord::Base.connection.execute(
      "SELECT activity_sessions.completed_at, activity_sessions.id AS activity_sessions_id, activities.name, activity_sessions.percentage, units.name AS unit_name, classroom_activities.completed AS is_a_completed_lesson FROM classroom_activities
       LEFT JOIN activity_sessions ON classroom_activities.id = activity_sessions.classroom_activity_id AND activity_sessions.user_id = #{student_id}
       JOIN units ON units.id = classroom_activities.unit_id
       JOIN activities ON activities.id = classroom_activities.activity_id
       WHERE classroom_activities.classroom_id = #{classroom_id} AND #{student_id} = ANY (classroom_activities.assigned_student_ids::int[])
       GROUP BY units.name, activity_sessions.completed_at, activities.name, activity_sessions.percentage, classroom_activities.completed, activity_sessions.id").to_a
  end
end
