# frozen_string_literal: true

class AddFunctionTimespentStudent < ActiveRecord::Migration[4.2]
  def up
    connection.execute(%q{
      CREATE OR REPLACE FUNCTION timespent_student(student int) RETURNS bigint AS $$
        SELECT COALESCE(SUM(time_spent),0) FROM (
          SELECT id,timespent_activity_session(id) AS time_spent FROM activity_sessions
          WHERE activity_sessions.user_id = student
          GROUP BY id) as as_ids;

      $$ LANGUAGE SQL;
    })
  end
  def down
    connection.execute(%q{
      DROP FUNCTION timespent_student;
    })
  end
end
