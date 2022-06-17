# frozen_string_literal: true

class ProgressReports::DistrictActivityScores
  attr_reader :admin_id

  def initialize(admin_id)
    @admin_id = admin_id
  end

  def results
    return [] if classroom_ids_for_admin.empty?

    RawSqlRunner.execute(query).to_a
  end

  private def classroom_ids_for_admin
    Classroom.joins(teachers: { school: :admins })
      .where('schools_admins.user_id = ?', admin_id)
      .pluck(:id)
      .join(', ')
  end

  private def query
    <<~SQL
      SELECT classrooms.name AS classroom_name,
        students.id AS student_id,
        students.last_active,
        students.name AS students_name,
        teachers.name AS teachers_name,
        schools.name AS schools_name,
        AVG(activity_sessions.percentage)
        FILTER(
          WHERE activities.activity_classification_id <> 6
          AND activities.activity_classification_id <> 4
        ) AS average_score,
        COUNT(activity_sessions.id) AS activity_count,
        SUM(activity_sessions.timespent) AS timespent,
        classrooms.id AS classroom_id
      FROM classroom_units
      JOIN activity_sessions
        ON classroom_units.id = activity_sessions.classroom_unit_id
      JOIN activities
        ON activity_sessions.activity_id = activities.id
      JOIN classrooms
        ON classrooms.id = classroom_units.classroom_id
      JOIN classrooms_teachers
        ON classrooms_teachers.classroom_id = classrooms.id
      JOIN users AS teachers
        ON teachers.id = classrooms_teachers.user_id
      JOIN schools_users
        ON schools_users.user_id = teachers.id
      JOIN schools
        ON schools.id = schools_users.school_id
      JOIN users AS students
        ON students.id = activity_sessions.user_id
      WHERE classroom_units.classroom_id IN (#{classroom_ids_for_admin})
      AND activity_sessions.is_final_score = TRUE
      AND classroom_units.visible = true
      GROUP BY
        classrooms.name,
        students.id,
        students.name,
        teachers.name,
        schools.name,
        classrooms.id,
        students.last_active
    SQL
  end
end
