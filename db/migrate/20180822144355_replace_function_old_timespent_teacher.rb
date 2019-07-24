class ReplaceFunctionOldTimespentTeacher < ActiveRecord::Migration
  # backward compatibility function. hardcoded timestamp should be the datetime
  # of the migration.
  def up
    connection.execute(%q{
      CREATE OR REPLACE FUNCTION old_timespent_teacher(teacher int) RETURNS bigint AS $$
        SELECT COALESCE(MAX(time_spent)::BIGINT, 0) FROM
        (SELECT MAX(time_spent_query.time_spent) AS time_spent
          FROM users
          LEFT OUTER JOIN (SELECT acss_ids.teacher_id, SUM (
              CASE
              WHEN (activity_sessions.started_at IS NULL)
                OR (activity_sessions.completed_at IS NULL)
                OR (activity_sessions.completed_at - activity_sessions.started_at < interval '1 minute')
                OR (activity_sessions.completed_at - activity_sessions.started_at > interval '30 minutes')
              THEN 441
              ELSE
                EXTRACT (
                  'epoch' FROM (activity_sessions.completed_at - activity_sessions.started_at)
                )
              END) AS time_spent FROM activity_sessions
            INNER JOIN (SELECT users.id AS teacher_id, activity_sessions.id AS activity_session_id FROM users
            INNER JOIN units ON users.id = units.user_id
            INNER JOIN classroom_units ON units.id = classroom_units.unit_id
            INNER JOIN activity_sessions ON classroom_units.id = activity_sessions.classroom_unit_id
            INNER JOIN concept_results ON activity_sessions.id = concept_results.activity_session_id
            WHERE users.id = teacher
            AND activity_sessions.completed_at < timestamp '2018-08-21 00:00:00.000000'
            AND activity_sessions.state = 'finished'
            GROUP BY users.id, activity_sessions.id) AS acss_ids ON activity_sessions.id = acss_ids.activity_session_id
            GROUP BY acss_ids.teacher_id
          ) AS time_spent_query ON users.id = time_spent_query.teacher_id
          WHERE users.id = teacher
          GROUP BY users.id) as times_spent;
      $$ LANGUAGE SQL;
    })
  end
  def down
    connection.execute(%q{
      DROP FUNCTION old_timespent_teacher;
    })
  end
end
