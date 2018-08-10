class ProgressReports::ActivitiesListByClassroom
  def self.results(classroom_id)
    ActiveRecord::Base.connection.execute(
      "SELECT students.id AS student_id, students.name, AVG(activity_sessions.percentage) AS average_score, COUNT(activity_sessions.id) AS activity_count FROM classroom_units
      JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id
      JOIN users AS students ON students.id = activity_sessions.user_id
      WHERE classroom_units.classroom_id = #{classroom_id} AND activity_sessions.is_final_score = TRUE
      GROUP BY students.id, students.name").to_a
  end
end
