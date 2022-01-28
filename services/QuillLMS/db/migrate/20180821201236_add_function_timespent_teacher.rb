# frozen_string_literal: true

class AddFunctionTimespentTeacher < ActiveRecord::Migration[4.2]
  def up
    connection.execute(%q{
      CREATE OR REPLACE FUNCTION timespent_teacher(teacher int) RETURNS bigint AS $$
        SELECT COALESCE(SUM(time_spent),0) FROM (SELECT activity_sessions.id as activity_session_id, timespent_activity_session(activity_sessions.id) as time_spent FROM users
          JOIN classrooms on users.id = classrooms.teacher_id
          JOIN classroom_activities ON classroom_activities.classroom_id = classrooms.id
          JOIN activity_sessions ON activity_sessions.id = classroom_activities.activity_id
          WHERE users.id = teacher
          GROUP BY activity_session_id) as times_spent;
      $$ LANGUAGE SQL;
    })
  end
  def down
    connection.execute(%q{
      DROP FUNCTION timespent_teacher;
    })
  end
end
