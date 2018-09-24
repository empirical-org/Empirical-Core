class ReplaceFunctionTimespentTeacher < ActiveRecord::Migration
  def up
    connection.execute(%q{
      CREATE OR REPLACE FUNCTION timespent_teacher(teacher int) RETURNS bigint AS $$
        SELECT COALESCE(SUM(time_spent),0) FROM (SELECT activity_sessions.id AS activity_session_id, timespent_activity_session(activity_sessions.id) as time_spent FROM users
          INNER JOIN classrooms_teachers ON users.id = classrooms_teachers.user_id
          INNER JOIN classroom_units ON classrooms_teachers.classroom_id = classroom_units.classroom_id
          INNER JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id
          WHERE users.id = teacher
          GROUP BY users.id, activity_sessions.id) as times_spent;
      $$ LANGUAGE SQL;
    })
  end
  def down
    connection.execute(%q{
      DROP FUNCTION timespent_teacher;
    })
  end
end
