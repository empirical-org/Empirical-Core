class ProgressReports::ActivitiesScoresByClassroom
  def self.results(classroom_ids)
    ids = classroom_ids.join(', ')
    ActiveRecord::Base.connection.execute(query(ids)).to_a
  end

  private

  def self.query(classroom_ids)
    <<~SQL
      SELECT classrooms.name AS classroom_name,
        students.id AS student_id,students.last_active,
        students.name,
        AVG(activity_sessions.percentage)
        FILTER(WHERE activities.activity_classification_id <> 6 AND activities.activity_classification_id <> 4) AS average_score,
        COUNT(activity_sessions.id) AS activity_count,
        classrooms.id AS classroom_id
      FROM classroom_activities
      JOIN activity_sessions ON classroom_activities.id = activity_sessions.classroom_activity_id
      JOIN activities ON classroom_activities.activity_id = activities.id
      JOIN classrooms ON classrooms.id = classroom_activities.classroom_id
      JOIN users AS students ON students.id = activity_sessions.user_id
      WHERE classroom_activities.classroom_id IN (#{classroom_ids})
      AND activity_sessions.is_final_score = TRUE
      AND classroom_activities.visible = true
      GROUP BY classrooms.name, students.id, students.name, classrooms.id, last_active
    SQL
  end
end
