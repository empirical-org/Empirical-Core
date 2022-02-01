# frozen_string_literal: true

class ReplaceFunctionTimepentActivitySessionAgain < ActiveRecord::Migration[4.2]
  def up
    connection.execute(%q{
      CREATE OR REPLACE FUNCTION timespent_activity_session(act_sess int) RETURNS integer AS $$
        DECLARE
            first_item timestamp;
          last_item timestamp;
          max_item timestamp;
          as_created_at timestamp;
          arow record;
          time_spent float;
          item timestamp;
        BEGIN
          -- backward compatibility block
          SELECT created_at INTO as_created_at FROM activity_sessions WHERE id = act_sess;
          IF as_created_at IS NULL OR as_created_at < timestamp '2018-08-25 00:00:00.000000' THEN
            SELECT SUM(
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
                END) INTO time_spent FROM activity_sessions WHERE id = act_sess AND state='finished';

                RETURN COALESCE(time_spent,0);
          END IF;
          -- modern calculation (using activity session interaction logs)
          first_item := NULL;
          last_item := NULL;
          max_item := NULL;
          time_spent := 0.0;
          FOR arow IN (SELECT date FROM activity_session_interaction_logs WHERE activity_session_id = act_sess order by date) LOOP
            item := arow;
            IF last_item IS NULL THEN
              first_item := item;
              max_item := item;
              last_item := item;
            ELSIF item - last_item <= '2 minute'::interval THEN
              max_item := item;
              last_item := item;
            ELSE
              time_spent := time_spent + EXTRACT( EPOCH FROM max_item - first_item );
              first_item := item;
              last_item := item;
              max_item := item;
            END IF;
          END LOOP;
          IF max_item IS NOT NULL AND first_item IS NOT NULL THEN
            time_spent := time_spent + EXTRACT( EPOCH FROM max_item - first_item );
          END IF;
          RETURN time_spent;
        END;
      $$ LANGUAGE plpgsql;
    })
  end
  def down
    connection.execute(%q{
      DROP FUNCTION timespent_activity_session;
    })
  end
end
